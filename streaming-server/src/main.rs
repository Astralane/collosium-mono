use std::collections::HashMap;
use std::net::{IpAddr, Ipv4Addr, SocketAddr};
use std::sync::{Arc};
use tokio::sync::Mutex;
use clap::Parser;
use tonic::transport::Server;

use jito_protos::solana::geyser::{SubscribeTransactionUpdatesRequest};
use jito_protos::streaming_service::streaming_service_server::StreamingServiceServer;

use crate::client::{get_geyser_client, get_relayer_client};
use crate::server::StreamingServerImpl;

use sqlx::postgres::PgPoolOptions;

mod client;
mod server;


#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
struct Args {
    #[arg(long, env, default_value = "20000")]
    port: u16,

    #[arg(long, env, default_value = "http://localhost:3000")]
    admin_server_url: String,

    #[arg(long, env, default_value = "http://localhost:10000")]
    geyser_url: String,

    #[arg(long, env, default_value = "http://localhost:11226")]
    relayer_url: String,

    #[arg(long, env, default_value = "localhost:5432")]
    db_address: String,

    #[arg(long, env, default_value = "postgres")]
    db_username: String,

    #[arg(long, env, default_value = "postgres")]
    db_password: String,

    #[arg(long, env, default_value = "postgres")]
    db_schema: String,
}

const DB_CONNECTION_POOL_SIZE: u32 = 10;

#[tokio::main]
async fn main() {
    let args: Args = Args::parse();

    let relayer_client = match get_relayer_client(&args.relayer_url).await {
        Ok(relayer_client) => {
            println!("connected to relayer at {0}", &args.relayer_url);
            Some(relayer_client)
        },
        Err(err) => {
            println!("failed to connect to relayer at {0}, proceeding without it. Err: {1}", &args.relayer_url, err);
            None
        }
    };

    let geyser_client = match get_geyser_client(&args.geyser_url).await {
        Ok(geyser_client) => {
            println!("connected to geyser at {0}", &args.geyser_url);
            Some(geyser_client)
        },
        Err(err) => {
            println!("failed to connect to geyser at {0}, proceeding without it. Err: {1}", &args.geyser_url, err);
            None
        }
    };

    let relayer_subscription = match relayer_client {
        Some(mut relayer_client) => {
            let relayer_subscription = relayer_client.subscribe_client_packets(
                jito_protos::relayer::SubscribePacketsRequest {}
            ).await;
            Some(relayer_subscription.unwrap().into_inner())
        }
        None => None,
    };

    let geyser_subscription = match geyser_client {
        Some(mut geyser_client) => {
            let geyser_subscription = geyser_client.subscribe_transaction_updates(
                SubscribeTransactionUpdatesRequest {}
            ).await;
            Some(geyser_subscription.unwrap().into_inner())
        }
        None => None
    };

    let processed_selectors = Arc::new(Mutex::new(HashMap::new()));
    let unprocessed_selectors = Arc::new(Mutex::new(HashMap::new()));

    let db_pool = PgPoolOptions::new()
        .max_connections(DB_CONNECTION_POOL_SIZE)
        .connect(&format!(
            "postgres://{0}:{1}@{2}/{3}",
            &args.db_username,
            &args.db_password,
            &args.db_address,
            &args.db_schema,
        )).await.unwrap();

    let streaming_server = StreamingServerImpl::new(
        processed_selectors,
        unprocessed_selectors,
        args.admin_server_url,
        db_pool
    );
    let mut streaming_server_copy = streaming_server.clone();

    tokio::spawn(async move {
        streaming_server_copy.serve(geyser_subscription, relayer_subscription).await;
    });

    let server_addr = IpAddr::V4(Ipv4Addr::new(127,0,0,1));
    println!("starting streaming server at {0}:{1}", server_addr, args.port);
    Server::builder()
        .add_service(StreamingServiceServer::new(
            streaming_server
        ))
        .serve(SocketAddr::new(server_addr, args.port))
        .await
        .expect("streaming server failed");

    println!("streaming server finished");
}
