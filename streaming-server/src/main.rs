use std::collections::HashMap;
use std::net::{IpAddr, Ipv4Addr, SocketAddr};
use std::sync::{Arc};
use tokio::sync::Mutex;

use tonic::Streaming;
use tonic::transport::Server;

use jito_protos::relayer::SubscribePacketsResponse;
use jito_protos::solana::geyser::{SubscribeTransactionUpdatesRequest, TimestampedTransactionUpdate};
use jito_protos::streaming_service::streaming_service_server::StreamingServiceServer;

use crate::client::{get_geyser_client, get_relayer_client};
use crate::server::StreamingServerImpl;

use dotenv::dotenv; 

mod client;
mod server;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let mut relayer_client = get_relayer_client("http://localhost:11226")
        .await
        .expect("connect to relayer client failed");

    let mut geyser_client = get_geyser_client("http://localhost:10000")
        .await
        .expect("connect to geyser client failed");

    let relayer_subscription = relayer_client.subscribe_client_packets(
        jito_protos::relayer::SubscribePacketsRequest {}
    ).await;
    let relayer_subscription: Streaming<SubscribePacketsResponse> = relayer_subscription.unwrap().into_inner();

    let geyser_subscription = geyser_client.subscribe_transaction_updates(
        SubscribeTransactionUpdatesRequest {}
    ).await;
    let geyser_subscription: Streaming<TimestampedTransactionUpdate> = geyser_subscription.unwrap().into_inner();

    let processed_selectors = Arc::new(Mutex::new(HashMap::new()));
    let unprocessed_selectors = Arc::new(Mutex::new(HashMap::new()));

    let streaming_server = StreamingServerImpl::new(processed_selectors, unprocessed_selectors);
    let mut streaming_server_copy = streaming_server.clone();

    tokio::spawn(async move {
        streaming_server_copy.serve(geyser_subscription, relayer_subscription).await;
    });

    let server_addr = IpAddr::V4(Ipv4Addr::new(127,0,0,1));
    println!("starting streaming server at: {:?}", server_addr);
    Server::builder()
        .add_service(StreamingServiceServer::new(
            streaming_server
        ))
        .serve(SocketAddr::new(server_addr, 20000))
        .await
        .expect("streaming server failed");

    println!("streaming server finished");
}
