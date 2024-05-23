use std::collections::{HashMap, HashSet};
use std::env;
use std::str::FromStr;
use std::sync::Arc;

use bincode::Options;
use solana_client::client_error::reqwest::Client;
use solana_program::pubkey::Pubkey;
use solana_sdk::packet::PACKET_DATA_SIZE;
use solana_sdk::transaction::VersionedTransaction;
use tokio::sync::mpsc::{channel, Sender};
use tokio::sync::Mutex;
use tokio_stream::wrappers::ReceiverStream;
use tonic::{Request, Response, Status, Streaming};

use jito_protos::relayer::subscribe_packets_response::Msg;
use jito_protos::solana::geyser::TimestampedTransactionUpdate;
use jito_protos::streaming_service::streaming_service_server::StreamingService;
use jito_protos::streaming_service::SubscribePacketsRequest;
use jito_protos::streaming_service::SubscribePacketsResponse;

type ProcessedSelectorsMap = Arc<Mutex<HashMap<Pubkey, Vec<Sender<Result<TimestampedTransactionUpdate, Status>>>>>>;
type UnprocessedSelectorsMap = Arc<Mutex<HashMap<Pubkey, Vec<Sender<Result<SubscribePacketsResponse, Status>>>>>>;

pub struct StreamingServerImpl {
    processed_selectors: ProcessedSelectorsMap,
    unprocessed_selectors: UnprocessedSelectorsMap,
}

impl StreamingServerImpl {
    pub fn new(processed_selectors: ProcessedSelectorsMap,
               unprocessed_selectors: UnprocessedSelectorsMap) -> Self {
        StreamingServerImpl {
            processed_selectors,
            unprocessed_selectors,
        }
    }

    pub(crate) async fn serve(
        &mut self,
        mut geyser_subscription: Streaming<TimestampedTransactionUpdate>,
        mut relayer_subscription: Streaming<jito_protos::relayer::SubscribePacketsResponse>,
    ) {
        loop {
            tokio::select! {
                geyser_packet = geyser_subscription.message() => {
                    let resp = geyser_packet.unwrap().unwrap();

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

                relayer_packet = relayer_subscription.message() => {
                    let resp = relayer_packet.unwrap().unwrap();

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
            }
        }
    }
}

impl Clone for StreamingServerImpl {
    fn clone(&self) -> Self {
        StreamingServerImpl {
            processed_selectors: self.processed_selectors.clone(),
            unprocessed_selectors: self.unprocessed_selectors.clone(),
        }
    }
}


async fn validate_api_key(api_key: &str) -> bool {
    let client = Client::new();
    let admin_service_api_url = 
        env::var("ASTRALINE_ADMIN_SERVICE_API_URL")
        .expect("Admin service api url should be provided");

    let url = format!("{}/exists/{}", admin_service_api_url, api_key);

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

        if !validate_api_key(&request.api_key).await {
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

        if !validate_api_key(&request.api_key).await {
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