use crate::clickhouse_client::{ClickhouseClient, Insertable};
use std::sync::Arc;
use substreams_rs::substream_stream::{BlockResponse, SubstreamsStream};
use substreams_rs::substreams::SubstreamsEndpoint;
use tokio_stream::StreamExt;

#[derive(Clone)]
pub(crate) struct SubstreamClient {
    token: Option<String>,
    package: String,
}

impl SubstreamClient {
    pub fn new(package: String) -> Self {
        let token = std::env::var("SUBSTREAMS_API_TOKEN").ok();
        if token.is_none() {
            panic!("No SUBSTREAMS_API_TOKEN found in environment");
        }
        Self { package, token }
    }

    pub async fn start_streaming<T>(
        self,
        db: Arc<ClickhouseClient>,
        module: String,
        start: u64,
        end: u64,
    ) where
        T: prost::Message + Default + Into<Insertable>,
    {
        let endpoint =
            SubstreamsEndpoint::new("https://mainnet.sol.streamingfast.io:443", self.token).await;
        let package = substreams_rs::utils::read_package(&self.package)
            .await
            .unwrap();
        let mut substream = SubstreamsStream::new(
            Arc::new(endpoint.unwrap()),
            None,
            package.modules,
            module,
            start,
            end,
        );

        loop {
            tokio::select! {
                    message = substream.next() => {
                        match message {
                            None => {
                                tracing::info!("Stream consumed");
                                break;
                            }
                            Some(Ok(BlockResponse::New(data))) => {
                                let output = data.output.as_ref().unwrap().map_output.as_ref().unwrap();
                                let out = T::decode(output.value.as_slice());
                                match out {
                                    Ok(out) => {
                                        let result = db.insert(out.into()).await;
                                        if let Err(err) = result {
                                            tracing::error!("Error inserting data: {:?}", err);
                                            break;
                                        }
                                    }
                                    Err(err) => {
                                        tracing::error!("Error decoding output: {:?}", err);
                                        break;
                                    }
                                }
                            }
                            Some(Ok(BlockResponse::Undo(undo_signal))) => {
                                tracing::warn!("Undo block data: {:?}", undo_signal);
                                //TODO: Implement undo logic
                            }
                            Some(Err(err)) => {
                                tracing::error!("Stream terminated with error: {:?}", err);
                                break;
                            }
                        }
                    }
            }
        }
    }
}
