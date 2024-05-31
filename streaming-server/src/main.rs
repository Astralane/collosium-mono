use std::collections::HashMap;
use std::net::ToSocketAddrs;
use std::sync::Arc;

use clap::Parser;
use sqlx::postgres::PgPoolOptions;
use tokio::sync::Mutex;
use tonic::transport::Server;

use jito_protos::solana::geyser::SubscribeTransactionUpdatesRequest;
use jito_protos::streaming_service::streaming_service_server::StreamingServiceServer;

use crate::client::{get_geyser_client, get_relayer_client};
use crate::index::http_server::Indexer;
use crate::server::StreamingServerImpl;

mod client;
mod server;
mod ldb;
mod index;

#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
struct Args {
    #[arg(long, env, default_value = "localhost:20000")]
    bind_address: String,

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

    sqlx::migrate!("db/migrations")
        .run(&db_pool)
        .await.unwrap();

    let db_pool = Arc::from(Mutex::from(db_pool));


    let index_configs = Arc::new(Mutex::new(vec![]));
    /* example:
    vec![IndexConfiguration {
        name: String::from("test"),
        table_name: String::from("mich_test"),
        columns: vec![String::from("block_slot"), String::from("program_id")],
        filters: vec![
            IndexFilterEntity {
                column: String::from("block_slot"),
                predicates: vec![IndexFilterPredicate::GT {value: String::from("111792")}]
            },
            IndexFilterEntity {
                column: String::from("program_id"),
                predicates: vec![IndexFilterPredicate::IN {value: vec![String::from("11111111111111111111111111111111")]}]
            },
            IndexFilterEntity {
                column: String::from("account_arguments"),
                predicates: vec![IndexFilterPredicate::CONTAINS {value: String::from("72i21TqCQw6oTGULXHNmuHkyrzyjbsGVdem1f4mUnAMJ")}]
            },
        ]
    }]
     */
    let index_http_server = Indexer::new(db_pool.clone(), index_configs.clone()).await;

    tokio::spawn(async move {
        index_http_server.start().await;
    });

    let streaming_server = StreamingServerImpl::new(
        processed_selectors,
        unprocessed_selectors,
        args.admin_server_url,
        db_pool,
        index_configs.clone()
    );
    let mut streaming_server_copy = streaming_server.clone();

    tokio::spawn(async move {
        streaming_server_copy.serve(geyser_subscription, relayer_subscription).await;
    });

    println!("starting streaming server at grpc://{0}", args.bind_address);
    Server::builder()
        .add_service(StreamingServiceServer::new(
            streaming_server
        ))
        .serve(args.bind_address.to_socket_addrs().unwrap().next().unwrap())
        .await
        .expect("streaming server failed");

    println!("streaming server finished");
}
