use std::sync::Arc;

use actix_web::{error, web, App, Error, HttpMessage, HttpRequest, HttpResponse, HttpServer};
use log::info;
use serde::Deserialize;
use serde_json::Value::Null;
use sqlx::{Pool, Postgres};
use tokio::sync::Mutex;
use uuid::Uuid;

use astraline_streaming_server::Result;

use crate::idl::idl::IDLDownloader;
use crate::index::middleware::ApiKeyMiddleware;
use crate::index::parser::IndexFilterPredicate::EQ;
use crate::ldb::solana_instructions;
use crate::ldb::solana_instructions::is_custom_column;
use futures::executor::block_on;
use serde_json::json;

use super::parser::{IndexConfiguration, IndexConfigurationDTO};

#[derive(Clone)]
struct DataWrapper {
    db: Arc<Mutex<Pool<Postgres>>>,
    index_configs: Arc<Mutex<Vec<IndexConfiguration>>>,
    idl_downloader: Arc<Mutex<IDLDownloader>>,
}

#[derive(Deserialize)]
struct ProgramIDLQuery {
    program: String,
}

pub struct Indexer {
    server: IndexerHttpServer,
    data: DataWrapper,
}
struct IndexerHttpServer {
    port: i16,
    admin_server_url: String,
}

impl Indexer {
    pub async fn new(
        db_pool: Arc<Mutex<Pool<Postgres>>>,
        index_configs: Arc<Mutex<Vec<IndexConfiguration>>>,
        rpc_url: &str,
        admin_server_url: &str,
    ) -> Self {
        Self {
            server: IndexerHttpServer::new(9696, admin_server_url),
            data: DataWrapper {
                db: db_pool.clone(),
                index_configs,
                idl_downloader: Arc::new(Mutex::new(IDLDownloader::new(rpc_url, db_pool))),
            },
        }
    }

    pub async fn start(&self) {
        self.server.start(self.data.clone()).await;
    }
}

impl IndexerHttpServer {
    pub fn new(port: i16, admin_server_url: &str) -> Self {
        Self {
            port,
            admin_server_url: String::from(admin_server_url),
        }
    }

    pub async fn start(&self, db: DataWrapper) {
        let addr = format!("127.0.0.1:{}", self.port);
        info!(
            "starting http server at http://{0}:{1}",
            "localhost", self.port
        );
        let auth_middleware = ApiKeyMiddleware::new(&self.admin_server_url);
        let server = HttpServer::new(move || {
            App::new()
                .app_data(web::Data::new(db.clone()))
                .wrap(auth_middleware.clone())
                .service(web::resource("/index").route(web::post().to(Self::create_new_index)))
                .service(web::resource("/idl").route(web::get().to(Self::fetch_idl)))
        })
        .bind(addr)
        .unwrap()
        .run();
        server.await.expect("http server failed to start");
    }

    async fn fetch_idl(
        program: web::Query<ProgramIDLQuery>,
        data: web::Data<DataWrapper>,
    ) -> std::result::Result<HttpResponse, Error> {
        let program = program.program.clone();

        let idl_downloader = data.idl_downloader.lock().await;
        let idl = idl_downloader.download_idl(&program).await.unwrap();

        Ok(HttpResponse::Ok()
            .content_type(actix_web::http::header::ContentType::json())
            .body(idl))
    }

    async fn create_new_index(
        mut raw_data: web::Json<IndexConfigurationDTO>,
        data: web::Data<DataWrapper>,
        req: HttpRequest,
    ) -> std::result::Result<HttpResponse, Error> {
        let index_id = Uuid::new_v4();
        let index_id_underscored = index_id.to_string().replace("-", "_");
        let api_key = req.extensions().get::<String>().cloned().unwrap_or_default();
        // println!("API Key: {}", api_key);

        let raw_data = IndexConfiguration {
            name: std::mem::replace(&mut raw_data.name, String::new()),
            table_name: format!("index_{index_id_underscored}"),
            columns: std::mem::replace(&mut raw_data.columns, vec![]),
            filters: std::mem::replace(&mut raw_data.filters, vec![]),
        };
        let json_config = serde_json::to_string(&raw_data).unwrap();

        let mut connection = data.db.lock().await.acquire().await.unwrap();
        // raw_data.table_name = format!("index_{access_key_underscored}");
        let res = sqlx::query(
            "insert into index_configuration (index_id, table_name, json_config, api_key) \
                    values ($1, $2, $3, $4)",
        )
            .bind(index_id)
            .bind(&raw_data.table_name)
            .bind(sqlx::types::Json(json_config.clone()))
            .bind(api_key)
            .execute(&mut connection)
            .await;

        if let Err(_) = res {
            println!("error: {}", res.err().unwrap());
            return Ok(HttpResponse::InternalServerError().finish());
        }

        let columns = raw_data
            .columns
            .iter()
            .map(|column_name| {
                format!(
                    "{0} {1}",
                    column_name,
                    solana_instructions::column_type(column_name).unwrap()
                )
            })
            .collect::<Vec<String>>()
            .join(", ");

        let create_query = format!("create table {0} ({1})", &raw_data.table_name, columns);

        let res = sqlx::query(&create_query).execute(&mut connection).await;

        if let Err(_) = res {
            println!("error: {}", res.err().unwrap());
            return Ok(HttpResponse::InternalServerError().finish());
        }

        if let Err(err) = maybe_store_idl(data.idl_downloader.clone(), &json_config).await {
            return Err(error::ErrorBadRequest(err));
        }

        let mut configs = data.index_configs.lock().await;
        configs.push(raw_data);

        Ok(HttpResponse::Ok().json(format!("{}", index_id)))
    }
}

async fn maybe_store_idl(
    idl_downloader: Arc<Mutex<IDLDownloader>>,
    json_config: &str,
) -> Result<()> {
    let idl_downloader = idl_downloader.lock().await;
    let config: IndexConfiguration = serde_json::from_str(json_config).unwrap();

    if let Some(programPredicate) = config
        .filters
        .iter()
        .find(|filter| filter.column == "program_id")
    {
        let eq_predicate = programPredicate
            .predicates
            .iter()
            .find(|index_predicate| match index_predicate {
                EQ { .. } => true,
                _ => false,
            })
            .map(|index_predicate| match index_predicate {
                EQ { value } => value,
                _ => &Null,
            });
        if let Some(eq_predicate) = eq_predicate {
            let program_pubkey = eq_predicate.as_array().unwrap()[0].as_str().unwrap();

            // download idl only of
            let custom_filter_exists = config
                .filters
                .iter()
                .find(|filter| is_custom_column(&filter.column))
                .is_some();
            let custom_column_exists = config
                .columns
                .iter()
                .find(|column| is_custom_column(&column))
                .is_some();
            if custom_filter_exists || custom_column_exists {
                if let Ok(program_idl) = idl_downloader.download_idl(program_pubkey).await {
                    idl_downloader
                        .store_idl(program_pubkey, &program_idl)
                        .await
                        .unwrap();
                } else {
                    return Err(format!("Can't find idl for program {program_pubkey}"));
                }
            }
        }
    }

    Ok(())
}