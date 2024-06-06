use std::collections::{HashMap, HashSet};
use std::str::FromStr;
use std::sync::Arc;

use bincode::Options;
use solana_client::client_error::reqwest::Client;
use solana_program::pubkey::Pubkey;
use solana_sdk::bs58;
use solana_sdk::packet::PACKET_DATA_SIZE;
use solana_sdk::transaction::VersionedTransaction;
use sqlx::{Pool, Postgres};
use sqlx::postgres::PgQueryResult;
use tokio::sync::mpsc::{channel, Sender};
use tokio::sync::Mutex;
use tokio_stream::wrappers::ReceiverStream;
use tonic::{Request, Response, Status, Streaming};

use jito_protos::relayer::subscribe_packets_response::Msg;
use jito_protos::solana::geyser::TimestampedTransactionUpdate;
use jito_protos::streaming_service::streaming_service_server::StreamingService;
use jito_protos::streaming_service::SubscribePacketsRequest;
use jito_protos::streaming_service::SubscribePacketsResponse;

use crate::index::parser::IndexConfiguration;
use crate::ldb::solana_instructions;
use crate::ldb::solana_instructions::{SolanaInstruction, SolanaInstructionsColumn};

type ProcessedSelectorsMap = Arc<Mutex<HashMap<Pubkey, Vec<Sender<Result<TimestampedTransactionUpdate, Status>>>>>>;
type UnprocessedSelectorsMap = Arc<Mutex<HashMap<Pubkey, Vec<Sender<Result<SubscribePacketsResponse, Status>>>>>>;

pub struct StreamingServerImpl {
    processed_selectors: ProcessedSelectorsMap,
    unprocessed_selectors: UnprocessedSelectorsMap,
    admin_service_api_url: String,
    db_pool: Arc<Mutex<Pool<Postgres>>>,
    index_configs: Arc<Mutex<Vec<IndexConfiguration>>>
}

impl StreamingServerImpl {
    pub fn new(processed_selectors: ProcessedSelectorsMap,
               unprocessed_selectors: UnprocessedSelectorsMap,
               admin_service_api_url: String,
               db_pool: Arc<Mutex<Pool<Postgres>>>,
               index_configs: Arc<Mutex<Vec<IndexConfiguration>>>
    ) -> Self {
        StreamingServerImpl {
            processed_selectors,
            unprocessed_selectors,
            admin_service_api_url,
            db_pool,
            index_configs,
        }
    }

    pub(crate) async fn serve(
        &mut self,
        geyser_subscription: Option<Streaming<TimestampedTransactionUpdate>>,
        relayer_subscription: Option<Streaming<jito_protos::relayer::SubscribePacketsResponse>>,
    ) {
        if let Some(mut relayer_subscription) = relayer_subscription {
            if let Some(mut geyser_subscription) = geyser_subscription {
                loop {
                    tokio::select! {
                        Ok(Some(geyser_packet)) = geyser_subscription.message() => {
                            self.process_geyser(geyser_packet).await;
                        }

                        Ok(Some(relayer_packet)) = relayer_subscription.message() => {
                            self.process_relayer(relayer_packet).await;
                        }
                    }
                }
            } else {
                loop {
                    tokio::select! {
                        Ok(Some(relayer_packet)) = relayer_subscription.message() => {
                            self.process_relayer(relayer_packet).await;
                        }
                    }
                }
            }
        } else if let Some(mut geyser_subscription) = geyser_subscription {
            loop {
                tokio::select! {
                    Ok(Some(geyser_packet)) = geyser_subscription.message() => {
                        self.process_geyser(geyser_packet).await;
                    }
                }
            }
        }
    }


    async fn process_geyser(&mut self, geyser_packet: TimestampedTransactionUpdate) {
        let resp = geyser_packet;
        self.store_ldb_data(resp.clone()).await.unwrap();

        let instructions = solana_instructions::parse_instruction(&resp.clone());
        let index_configs = self.index_configs.lock().await;

        if !index_configs.is_empty() {
            for instruction in instructions {
                for index_config in index_configs.iter() {
                    let is_match = match_index_packet(&instruction, index_config).await;
                    if is_match {
                        self.store_index_instruction(&instruction, &index_config).await.expect("failed to store instruction");
                    }

                }
            }
        }

        let mut map_mut = self.processed_selectors.lock().await;
        let map = map_mut.clone();

        for (k, senders) in map.iter() {
            let resp = resp.clone();
            let keys = resp.clone()
                .transaction.unwrap()
                .tx.unwrap()
                .transaction.unwrap()
                .message.unwrap()
                .account_keys;

            for pubkey in keys {
                let pubkey: Pubkey = pubkey.try_into().unwrap();
                let mut failed_processed_senders = HashSet::new();
                if *k == pubkey {
                    for (i, sender) in senders.iter().enumerate() {
                        sender.send(Ok(resp.clone())).await.unwrap_or_else(|_| {
                            failed_processed_senders.insert(i);
                        });
                    }
                }

                let mut sorted_indices: Vec<_> = failed_processed_senders.into_iter().collect();
                sorted_indices.sort_unstable_by(|a, b| b.cmp(a));
                for index in sorted_indices {
                    let sender = map_mut.entry(*k).or_insert_with(Vec::new).remove(index);
                    drop(sender);
                }
            }
        }
    }

    async fn process_relayer(&mut self, relayer_packet: jito_protos::relayer::SubscribePacketsResponse) {
        let resp = relayer_packet;

        if let Some(msg) = resp.msg {
            match msg {
                Msg::Batch(batch) => {
                    let mut map_mut = self.unprocessed_selectors.lock().await;
                    let map = map_mut.clone();

                    for packet in batch.packets {
                        let tx: VersionedTransaction = bincode::options()
                            .with_limit(PACKET_DATA_SIZE as u64)
                            .with_fixint_encoding()
                            .reject_trailing_bytes()
                            .deserialize(&packet.clone().data).unwrap();

                        for pubkey in tx.message.static_account_keys() {
                            for (k, senders) in map.iter() {
                                let mut failed_unprocessed_senders = HashSet::new();
                                if k == pubkey {
                                    for (i, sender) in senders.iter().enumerate() {
                                        sender.send(Ok(
                                            SubscribePacketsResponse {
                                                batch: Some(jito_protos::packet::PacketBatch {
                                                    packets: vec![packet.clone()],
                                                })
                                            }
                                        )).await.unwrap_or_else(|_| {
                                            failed_unprocessed_senders.insert(i);
                                        });
                                    }
                                }
                                let mut sorted_indices: Vec<_> = failed_unprocessed_senders.into_iter().collect();
                                sorted_indices.sort_unstable_by(|a, b| b.cmp(a));
                                for index in sorted_indices {
                                    let sender = map_mut.entry(*k).or_insert_with(Vec::new).remove(index);
                                    drop(sender);
                                }
                            }


                        }
                    }
                }

                Msg::Heartbeat(_) => {

                }
            }
        }
    }

    async fn store_index_instruction(
        &self,
        instruction: &SolanaInstruction,
        index_config: &IndexConfiguration,
    ) -> Result<(), String> {
        let column_names = index_config.columns.join(", ");

        let column_placeholders = index_config.columns
            .iter()
            .enumerate()
            .map(|(index, _)| format!("${}", index + 1))
            .collect::<Vec<String>>()
            .join(", ");

        let query = format!("insert into {0}({1}) values ({2})",
            index_config.table_name,
            column_names,
            column_placeholders
        );

        let mut query = sqlx::query(&query);

        for column_name in index_config.columns.iter() {
            query = match solana_instructions::parse_column(&column_name, instruction).unwrap() {
                SolanaInstructionsColumn::BlockSlot(block_slot) => query.bind(block_slot as i64),
                SolanaInstructionsColumn::TxId(tx_id) => query.bind(tx_id),
                SolanaInstructionsColumn::TxIndex(tx_index) => query.bind(tx_index as i64),
                SolanaInstructionsColumn::ProgramId(program_id) => query.bind(program_id),
                SolanaInstructionsColumn::IsInner(is_inner) => query.bind(is_inner),
                SolanaInstructionsColumn::Data(data) => query.bind(data),
                SolanaInstructionsColumn::AccountArguments(account_arguments) => query.bind(account_arguments),
                SolanaInstructionsColumn::TxSigner(tx_signer) => query.bind(tx_signer),
                SolanaInstructionsColumn::TxSuccess(tx_success) => query.bind(tx_success),
            }
        }

        let db_lock = &self.db_pool.lock().await;
        let mut connection = db_lock.acquire().await.unwrap();

        query.execute(&mut connection).await.unwrap();

        Ok(())
    }

    async fn store_ldb_data(
        &mut self,
        packet: TimestampedTransactionUpdate
    ) -> Result<(), String> {
        let packet_tx = packet.transaction.ok_or("no packet")?;
        let confirmed_tx = packet_tx.tx.ok_or("no tx")?;
        let tx = confirmed_tx.transaction.ok_or("no transaction")?;
        let meta = confirmed_tx.meta.ok_or("no meta")?;
        let message = tx.message.ok_or("no message")?;
        let instructions = message.instructions;

        for instruction in instructions {
            self.store_instruction(
                packet_tx.slot as i64, &packet_tx.signature, packet_tx.tx_idx as i64,
                &message.account_keys, instruction.program_id_index as usize,
                false, &instruction.accounts, &instruction.data, meta.err.is_none()
            ).await
                // .map(|res | { println!("instruction stored: {0} ", packet_tx.signature); res })
                .map_err(|err| { format!("failed to store instruction: {0}, err: {1}", packet_tx.signature, err)})?;
        }

        for inner_instructions in meta.inner_instructions {
            for inner_instruction in inner_instructions.instructions {
                self.store_instruction(
                    packet_tx.slot as i64, &packet_tx.signature, packet_tx.tx_idx as i64,
                    &message.account_keys, inner_instruction.program_id_index as usize,
                    false, &inner_instruction.accounts, &inner_instruction.data, meta.err.is_none()
                ).await
                    // .map(|res | { println!("inner instruction stored: {0} ", packet_tx.signature); res})
                    .map_err(|err| { format!("failed to store inner instruction: {0}, err: {1}", packet_tx.signature, err)})?;
            }
        }

        Ok(())
    }

    async fn store_instruction(
        &self,
        slot: i64,
        signature: &str,
        tx_idx: i64,
        account_keys: &Vec<Vec<u8>>,
        program_id_index: usize,
        is_inner: bool,
        accounts: &Vec<u8>,
        data: &Vec<u8>,
        tx_success: bool,
    ) -> Result<PgQueryResult, sqlx::Error> {
        let program_id = &account_keys[program_id_index];
        let program_id = bs58::encode(program_id).into_string();

        let data = bs58::encode(data).into_string();

        let account_arguments: Vec<String> = accounts.iter()
            .map(
                |account_index| {
                    let account_index = *account_index as usize;
                    let account = bs58::encode(&account_keys[account_index]).into_string();
                    account
                }
            )
            .collect();

        let signer = account_arguments[0].clone();

        let db_lock = &self.db_pool.lock().await;
        let mut connection = db_lock.acquire().await.unwrap();
        sqlx::query(
            "insert into solana_instructions (block_slot, tx_id, tx_index, program_id, is_inner, data, account_arguments, tx_signer, tx_success) \
                    values ($1, $2, $3, $4, $5, $6, $7, $8, $9)")
            .bind(slot)
            .bind(signature)
            .bind(tx_idx)
            .bind(&program_id)
            .bind(is_inner)
            .bind(&data)
            .bind(account_arguments)
            .bind(signer)
            .bind(tx_success)
            .execute(&mut connection).await
    }
}

impl Clone for StreamingServerImpl {
    fn clone(&self) -> Self {
        StreamingServerImpl {
            processed_selectors: self.processed_selectors.clone(),
            unprocessed_selectors: self.unprocessed_selectors.clone(),
            admin_service_api_url: self.admin_service_api_url.clone(),
            db_pool: self.db_pool.clone(),
            index_configs: self.index_configs.clone()
        }
    }
}

// block_slot, tx_id, tx_index, program_id, is_inner, data, account_arguments, tx_signer, tx_success
async fn match_index_packet(instruction: &SolanaInstruction, index_config: &IndexConfiguration) -> bool {
    if index_config.filters.is_empty() {
        println!("No filters found for index configuration");
        return false
    }

    for filter_entity in index_config.filters.iter() {
        for filter_predicate in filter_entity.predicates.iter() {
            let column = solana_instructions::parse_column(&filter_entity.column, instruction);
            if let Ok(column) = column {
                let predicate = filter_predicate.to_predicate();
                if !column.check(&*predicate) {
                    println!("Instruction did not match filter: column: {:?}, predicate: {:?}", filter_entity.column, filter_predicate);
                    return false
                }
            } else {
                println!("Failed to parse column: {}", filter_entity.column);
                return false
            }
        }
    }
    println!("Instruction matched all filters");
    true
}


async fn validate_api_key(api_key: &str, admin_service_api_url: &str) -> bool {
    let client = Client::new();
    let url = format!("{}/keys/{}", admin_service_api_url, api_key);

    match client.get(&url).send().await {
        Ok(response) => response.status().is_success(),
        Err(err) => {
            eprintln!("Failed to send request: {:?}", err);
            false
        }
    }
}

#[tonic::async_trait]
impl StreamingService for StreamingServerImpl {
    type SubscribeUnprocessedPacketsStream = ReceiverStream<Result<SubscribePacketsResponse, Status>>;

    async fn subscribe_unprocessed_packets(&self, request: Request<SubscribePacketsRequest>) -> Result<Response<Self::SubscribeUnprocessedPacketsStream>, Status> {
        println!("Received unprocessed subscribe request: {:?}", request);
        let request = request.into_inner();

        if !validate_api_key(&request.api_key, &self.admin_service_api_url).await {
            return Err(Status::unauthenticated("Invalid API Key"));
        }

        let (sender, receiver) = channel(50_000);

        for account in request.accounts {
            self.unprocessed_selectors.lock().await
                .entry(Pubkey::from_str(&account).unwrap())
                .or_insert_with(Vec::new)
                .push(sender.clone());
        }

        Ok(Response::new(ReceiverStream::new(receiver)))
    }

    type SubscribeProcessedPacketsStream = ReceiverStream<Result<TimestampedTransactionUpdate, Status>>;

    async fn subscribe_processed_packets(&self, request: Request<SubscribePacketsRequest>) -> Result<Response<Self::SubscribeProcessedPacketsStream>, Status> {
        println!("Received processed subscribe request: {:?}", request);
        let request = request.into_inner();

        if !validate_api_key(&request.api_key, &self.admin_service_api_url).await {
            return Err(Status::unauthenticated("Invalid API Key"));
        }

        let (sender, receiver) = channel(50_000);

        for account in request.accounts.iter() {
            self.processed_selectors.lock().await
                .entry(Pubkey::from_str(account).unwrap())
                .or_insert_with(Vec::new)
                .push(sender.clone());
        }

        Ok(Response::new(ReceiverStream::new(receiver)))
    }
}