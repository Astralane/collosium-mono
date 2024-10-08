use crate::db_types::{SandwichRow, TransferRow};
use crate::sf::solana::dex::sandwiches::v1::SandwichOutput;
use crate::sf::solana::transfer::v1::TransferOutput;
use anyhow::Context;
use clickhouse::Row;
use serde::Serialize;
use tokio::task::JoinHandle;

pub struct ClientHandle {
    jh: JoinHandle<()>,
    shutdown: tokio::sync::oneshot::Sender<()>,
}

pub enum Insertable {
    Sandwiches(Vec<SandwichRow>),
    Tips(Vec<TransferRow>),
}

impl From<SandwichOutput> for Insertable {
    fn from(value: SandwichOutput) -> Self {
        let rows = value
            .data
            .into_iter()
            .map(|s| SandwichRow::from(s))
            .collect();
        Insertable::Sandwiches(rows)
    }
}

impl From<TransferOutput> for Insertable {
    fn from(value: TransferOutput) -> Self {
        let rows = value
            .transfers
            .into_iter()
            .map(|t| TransferRow::from(t))
            .collect();
        Insertable::Tips(rows)
    }
}

pub struct InsertRequest {
    data: Insertable,
    table: &'static str,
}

impl ClientHandle {
    pub async fn shutdown(self) {
        self.shutdown.send(()).expect("cannot send shutdown signal");
        self.jh.await.unwrap();
    }
}
pub struct ClickhouseClient {
    sender: tokio::sync::mpsc::Sender<InsertRequest>,
}

impl ClickhouseClient {
    pub async fn new(client: clickhouse::Client) -> anyhow::Result<(Self, ClientHandle)> {
        let (sender, recv) = tokio::sync::mpsc::channel(500000);
        let (shutdown, shutdown_receiver) = tokio::sync::oneshot::channel();
        let sql_files = vec![
            include_str!("./tables/tips.sql"),
            include_str!("./tables/sandwich.sql"),
        ];
        for sql in sql_files {
            //TODO: shutdown if error here
            client.query(sql).execute().await?;
        }
        let jh = tokio::spawn(run_service(client, recv, shutdown_receiver));
        Ok((Self { sender }, ClientHandle { jh, shutdown }))
    }

    pub async fn insert(&self, data: Insertable) -> anyhow::Result<()> {
        let table = match data {
            Insertable::Sandwiches(_) => "default.sandwiches",
            Insertable::Tips(_) => "default.tips",
        };
        let request = InsertRequest { data, table };
        self.sender
            .send(request)
            .await
            .context("cannot send insert request")
    }
}

async fn run_service(
    client: clickhouse::Client,
    mut work_input: tokio::sync::mpsc::Receiver<InsertRequest>,
    mut shutdown_receiver: tokio::sync::oneshot::Receiver<()>,
) {
    loop {
        let client_clone = client.clone();
        tokio::select! {
            _ = &mut shutdown_receiver => {
                tracing::warn!("Shutting down clickhouse client");
                break;
            },
            request = work_input.recv() => {
                match request {
                    Some(request) => {
                        let result;
                        match request.data {
                            Insertable::Sandwiches(rows) => {
                                result = store_data(&client_clone, &rows, request.table).await;
                            }
                            Insertable::Tips(rows) => {
                                result = store_data(&client_clone, &rows, request.table).await;
                            }
                        }
                        //handle error
                        if let Err(err) = result {
                            tracing::error!("Error inserting data: {:?}", err);
                            break;
                        }
                    }
                    None => {
                        //usually can happen if sender has been dropped (ie, done processing)
                        tracing::error!("Channel closed, shutting down clickhouse client");
                        break;
                    }
                }
            }
        }
    }

    //shutdown has been called or some error occurred
    //drain the queue
    while let Some(request) = work_input.recv().await {
        let result;
        match request.data {
            Insertable::Sandwiches(rows) => {
                result = store_data(&client, &rows, request.table).await;
            }
            Insertable::Tips(rows) => {
                result = store_data(&client, &rows, request.table).await;
            }
        }
        //handle error
        if let Err(err) = result {
            tracing::error!("Error inserting data: {:?}", err);
        }
    }
}

pub async fn store_data<T>(
    client: &clickhouse::Client,
    items: &Vec<T>,
    table: &str,
) -> anyhow::Result<()>
where
    T: Row + Serialize,
{
    if items.is_empty() {
        return Ok(());
    }
    tracing::info!("Inserting {} items into table {}", items.len(), table);
    let mut inserter = client.inserter(table).unwrap();
    for item in items.iter() {
        inserter
            .write(item)
            .context("cannot write item to inserter")?;
    }
    inserter
        .end()
        .await
        .context("cannot commit inserter for table {:table?}")?;
    Ok(())
}
