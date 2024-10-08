mod clickhouse_client;
mod db_types;
mod substream_client;

use crate::clickhouse_client::ClickhouseClient;
use crate::sf::solana;
use crate::substream_client::SubstreamClient;
use clap::Parser;
use std::sync::Arc;
use tracing::Level;
use tracing_subscriber::fmt::format::FmtSpan;

include!("pb/pb.rs");

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
struct Args {
    /// Name of the person to greet
    #[arg(long)]
    db_url: String,
    /// Number of times to greet
    #[arg(long, default_value = "default")]
    db_user: String,
    ///password
    #[arg(long)]
    db_password: String,
    ///database
    #[arg(long, default_value = "default")]
    db_database: String,
    ///package
    #[arg(long)]
    package: String,
    ///from block
    #[arg(long, default_value = "283581338")]
    from: u64,
    ///to block
    #[arg(long, default_value = "283581339")]
    to: u64,
}
#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .compact()
        .with_thread_ids(true)
        // sets this to be the default, global subscriber for this application.
        .init();

    let start = std::time::Instant::now();
    tracing::info!("Starting MEV sink");

    let args = Args::parse();
    tracing::info!("syncing blocks from {} to {}, {} blocks", args.from, args.to, args.to - args.from);

    let clickhouse = clickhouse::Client::default()
        .with_url(args.db_url)
        .with_user(&args.db_user)
        .with_password(&args.db_password)
        .with_database(&args.db_database);

    let (client, client_handle) = ClickhouseClient::new(clickhouse).await.unwrap();
    let db = Arc::new(client);
    let mev_client = SubstreamClient::new(args.package);

    let db_clone = db.clone();
    let mev_client_clone = mev_client.clone();
    let sandwiches_job = tokio::spawn(
        mev_client_clone.start_streaming::<solana::dex::sandwiches::v1::SandwichOutput>(
            db_clone,
            "map_to_sandwiches".to_string(),
            args.from,
            args.to,
        ),
    );

    let db_clone = db.clone();
    let tips_job = tokio::spawn(
        mev_client.start_streaming::<solana::transfer::v1::TransferOutput>(
            db_clone,
            "map_tips".to_string(),
            args.from,
            args.to,
        ),
    );

    sandwiches_job.await.expect("error in streaming tips");
    tips_job.await.expect("error in streaming sandwiches");

    tracing::info!("all stream finished in {:?}", start.elapsed());

    //all jobs finished sending, call shutdown
    client_handle.shutdown().await;

    tracing::info!("program finished in {:?}", start.elapsed());
    //sleep for 10s for tasks in database background to finish
    tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;
}
