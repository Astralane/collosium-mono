use std::{
    collections::HashSet,
    str::FromStr,
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc, Mutex,
    },
    thread::{Builder, JoinHandle},
    time::{Duration, Instant, SystemTime},
};
use std::net::SocketAddr;
use dashmap::DashMap;
use jito_core::ofac::is_tx_ofac_related;
use jito_protos::{
    auth::{
        auth_service_client::AuthServiceClient, GenerateAuthChallengeRequest,
        GenerateAuthTokensRequest, GenerateAuthTokensResponse, RefreshAccessTokenRequest, Role,
        Token,
    },
    block_engine::{
        block_engine_relayer_client::BlockEngineRelayerClient, packet_batch_update::Msg,
        AccountsOfInterestRequest, AccountsOfInterestUpdate, ExpiringPacketBatch,
        PacketBatchUpdate, ProgramsOfInterestRequest, ProgramsOfInterestUpdate,
    },
    convert::packet_to_proto_packet,
    packet::PacketBatch as ProtoPacketBatch,
    shared::Header,
};
use log::{error, *};
use prost_types::Timestamp;
use rand::Rng;
use solana_core::banking_trace::BankingPacketBatch;
use solana_metrics::{datapoint_error, datapoint_info};
use solana_sdk::{
    address_lookup_table::AddressLookupTableAccount, pubkey::Pubkey, signature::Signer,
    signer::keypair::Keypair, transaction::VersionedTransaction,
};
use thiserror::Error;
use tokio::{
    runtime::Runtime,
    select,
    sync::{mpsc::Sender, mpsc::Receiver},
    time::{interval, sleep},
};
use tonic::{
    codegen::InterceptedService,
    service::Interceptor,
    transport::{Channel, Endpoint},
    Response, Status, Streaming,
};
use jito_protos::relayer::{subscribe_packets_response, SubscribePacketsResponse};

use crate::relayer::ClientPacketSubscriptions;
use tokio::sync::mpsc::{channel, error::TrySendError, Sender as TokioSender};

#[derive(Clone)]
pub struct BlockEnginePackets {
    pub banking_packet_batch: BankingPacketBatch,
    pub stamp: SystemTime,
    pub expiration: u32,
}

#[derive(Error, Debug)]
pub enum BlockEngineError {
    #[error("auth service failed: {0}")]
    AuthServiceFailure(String),

    #[error("block engine failed: {0}")]
    BlockEngineFailure(String),
}

pub type BlockEngineResult<T> = Result<T, BlockEngineError>;

pub struct ClientPacketSender {
    block_engine_forwarder: JoinHandle<()>,
}

impl ClientPacketSender {
    pub fn new(
        client_packet_subscriptions: ClientPacketSubscriptions,
        mut block_engine_receiver: Receiver<BlockEnginePackets>,
        validator_packet_batch_size: usize,
        exit: Arc<AtomicBool>,
    ) -> Self {
        // drain old buffered packets before streaming packets to the block engine
        while block_engine_receiver.try_recv().is_ok() {}

        let block_engine_forwarder = Builder::new()
            .name("client_packet_sender_thread".into())
            .spawn(move || {
                let rt = Runtime::new().unwrap();
                rt.block_on(async move {
                    while !exit.load(Ordering::Relaxed) {
                        select! {
                            Some(block_engine_batches) = block_engine_receiver.recv() => {
                                trace!("received block engine batches");
                                let mut l_client_packet_subscriptions = client_packet_subscriptions.write().unwrap();

                                let client_senders =
                                    l_client_packet_subscriptions.iter().collect::<Vec<(
                                        &SocketAddr,
                                        &TokioSender<Result<SubscribePacketsResponse, Status>>,
                                    )>>();

                                // remove discards + check for OFAC before forwarding
                                let packets: Vec<_> = block_engine_batches
                                    .banking_packet_batch
                                    .0
                                    .iter()
                                    .flat_map(|batch| {
                                        batch
                                            .iter()
                                            .filter(|p| !p.meta().discard())
                                            .filter_map(packet_to_proto_packet)
                                    })
                                    .collect();

                                let mut proto_packet_batches =
                                    Vec::with_capacity(packets.len() / validator_packet_batch_size);
                                for packet_chunk in packets.chunks(validator_packet_batch_size) {
                                    proto_packet_batches.push(ProtoPacketBatch {
                                        packets: packet_chunk.to_vec(),
                                    });
                                }

                                let mut failed_client_forwards = Vec::new();
                                for batch in proto_packet_batches {
                                    for (socket_addr, sender) in &client_senders {
                                        match sender.try_send(Ok(SubscribePacketsResponse {
                                            header: Some(Header {
                                                ts: Some(Timestamp::from(SystemTime::now())),
                                            }),
                                            msg: Some(subscribe_packets_response::Msg::Batch(batch.clone())),
                                        })) {
                                            Err(TrySendError::Full(_)) => {
                                                error!("packet channel is full for client");
                                            }
                                            Err(TrySendError::Closed(_)) => {
                                                error!("channel is closed for client");
                                                failed_client_forwards.push(**socket_addr);
                                                break;
                                            }
                                            _ => {
                                                debug!("packet sent to client")
                                            }
                                        }
                                    }
                                }
                                for disconnected in failed_client_forwards {
                                    if let Some(sender) = l_client_packet_subscriptions.remove(&disconnected) {
                                        drop(sender);
                                    }
                                }
                            }
                        }
                    }
                });
            }).unwrap();

        ClientPacketSender {
            block_engine_forwarder,
        }
    }

    pub fn join(self) -> std::thread::Result<()> {
        self.block_engine_forwarder.join()
    }
}