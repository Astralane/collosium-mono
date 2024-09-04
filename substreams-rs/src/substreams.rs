use crate::pb::sf::substreams::rpc::v2::stream_client::StreamClient;
use crate::pb::sf::substreams::rpc::v2::{Request, Response};
use std::sync::Arc;
use std::time::Duration;
use tonic::codec::CompressionEncoding;
use tonic::codegen::http::uri::Scheme;
use tonic::metadata::MetadataValue;
use tonic::transport::{Channel, ClientTlsConfig, Uri};

#[derive(Clone, Debug)]
pub struct SubstreamsEndpoint {
    pub uri: String,
    pub token: Option<String>,
    channel: Channel,
}

impl SubstreamsEndpoint {
    pub async fn new<S: AsRef<str>>(url: S, token: Option<String>) -> Result<Self, anyhow::Error> {
        let uri = url
            .as_ref()
            .parse::<Uri>()
            .expect("the url should have been validated by now, so it is a valid Uri");

        let endpoint = match uri.scheme().unwrap_or(&Scheme::HTTP).as_str() {
            "http" => Channel::builder(uri),
            "https" => Channel::builder(uri)
                .tls_config(ClientTlsConfig::new())
                .expect("TLS config on this host is invalid"),
            _ => panic!("invalid uri scheme for firehose endpoint"),
        }
        .connect_timeout(Duration::from_secs(10))
        .tcp_keepalive(Some(Duration::from_secs(30)));

        let uri = endpoint.uri().to_string();
        let channel = endpoint.connect_lazy();

        Ok(SubstreamsEndpoint {
            uri,
            channel,
            token,
        })
    }

    pub async fn substreams(
        self: Arc<Self>,
        request: Request,
    ) -> Result<tonic::Streaming<Response>, anyhow::Error> {
        let token_metadata: Option<MetadataValue<tonic::metadata::Ascii>> = match self.token.clone()
        {
            Some(token) => Some(token.as_str().try_into()?),
            None => None,
        };

        let mut client = StreamClient::with_interceptor(
            self.channel.clone(),
            move |mut r: tonic::Request<()>| {
                if let Some(ref t) = token_metadata {
                    r.metadata_mut().insert("authorization", t.clone());
                }

                Ok(r)
            },
        )
        .accept_compressed(CompressionEncoding::Gzip)
        .send_compressed(CompressionEncoding::Gzip);

        let response_stream = client.blocks(request).await?;
        let block_stream = response_stream.into_inner();

        Ok(block_stream)
    }
}
