use tonic::transport::{Channel, Endpoint};

use astraline_streaming_server::Result;
use jito_protos::relayer::relayer_client::RelayerClient;
use jito_protos::solana::geyser::geyser_client::GeyserClient;

pub async fn get_relayer_client(relayer_url: &str) -> Result<RelayerClient<Channel>> {
    let relayer_channel = create_grpc_channel(relayer_url).await?;
    let relayer_client = RelayerClient::new(relayer_channel);
    Ok(relayer_client)
}

pub async fn get_geyser_client(geyser_url: &str) -> Result<GeyserClient<Channel>> {
    let geyser_channel = create_grpc_channel(geyser_url).await?;
    let geyser_client = GeyserClient::new(geyser_channel);
    Ok(geyser_client)
}

pub async fn create_grpc_channel(url: &str) -> Result<Channel> {
    let endpoint = Endpoint::from_shared(url.to_string()).expect("invalid url");
    return Ok(endpoint.connect().await.unwrap());
}