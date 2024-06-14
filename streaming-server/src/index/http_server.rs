use std::sync::Arc;

use actix_web::{App, Error, HttpResponse, HttpServer, web};
use log::info;
use serde::Deserialize;
use serde_json::Value::Null;
use sqlx::{Pool, Postgres};
use tokio::sync::Mutex;
use uuid::Uuid;

use astraline_streaming_server::Result;

use crate::idl::idl::IDLDownloader;
use crate::index::middleware::ApiKeyMiddleware;
use futures::executor::block_on;
use serde_json::json;
use crate::index::parser::IndexFilterPredicate::EQ;
use crate::ldb::solana_instructions;

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
    admin_server_url: String
}

impl Indexer {
    pub async fn new(db_pool: Arc<Mutex<Pool<Postgres>>>,
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
        Self { port, admin_server_url: String::from(admin_server_url) }
    }

    pub async fn start(&self, db: DataWrapper) {
        let addr = format!("127.0.0.1:{}", self.port);
        info!("starting http server at http://{0}:{1}", "localhost", self.port);
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

        Ok(HttpResponse::Ok().content_type(actix_web::http::header::ContentType::json()).body(idl))
    }

    async fn create_new_index(
        mut raw_data: web::Json<IndexConfigurationDTO>,
        data: web::Data<DataWrapper>,
    ) -> std::result::Result<HttpResponse, Error> {



        let access_key = Uuid::new_v4();
        let access_key_underscored = access_key.to_string().replace("-", "_");

        let raw_data = IndexConfiguration {
            name: std::mem::replace(&mut raw_data.name, String::new()),
            table_name: format!("index_{access_key_underscored}"),
            columns: std::mem::replace(&mut raw_data.columns, vec![]),
            filters: std::mem::replace(&mut raw_data.filters, vec![]),
        };
        let json_config = serde_json::to_string(&raw_data).unwrap();

        let mut connection = data.db.lock().await.acquire().await.unwrap();
        // raw_data.table_name = format!("index_{access_key_underscored}");
        let res = sqlx::query(
            "insert into index_configuration (access_key, table_name, json_config) \
                    values ($1, $2, $3)",
        )
            .bind(access_key)
            .bind(&raw_data.table_name)
            .bind(sqlx::types::Json(json_config.clone()))
            .execute(&mut connection)
            .await;

        if let Err(_) = res {
            println!("error: {}", res.err().unwrap());
            return Ok(HttpResponse::InternalServerError().finish())
        }

        let columns = raw_data.columns.iter().map(|column_name| {
            format!("{0} {1}", column_name, solana_instructions::column_type(column_name).unwrap())
        }).collect::<Vec<String>>().join(", ");

        let create_query = format!("create table {0} ({1})", &raw_data.table_name, columns);


        let res = sqlx::query(&create_query)
            .execute(&mut connection)
            .await;

        if let Err(_) = res {
            println!("error: {}", res.err().unwrap());
            return Ok(HttpResponse::InternalServerError().finish())
        }

        maybe_store_idl(data.idl_downloader.clone(), &json_config).await.unwrap();

        let mut configs = data.index_configs.lock().await;
        configs.push(raw_data);

        Ok(HttpResponse::Ok().json(format!("{}", access_key)))
    }
}

async fn maybe_store_idl(idl_downloader: Arc<Mutex<IDLDownloader>>, json_config: &str) -> Result<()> {
    let idl_downloader = idl_downloader.lock().await;
    let config: IndexConfiguration = serde_json::from_str(json_config).unwrap();

    if let Some(programPredicate) = config.filters.iter().find(|filter| { filter.column == "program_id" }) {
        let eq_predicate = programPredicate.predicates.iter().find(|index_predicate| {
            match index_predicate {
                EQ { .. } => true,
                _ => false
            }
        }).map(|index_predicate| {
            match index_predicate {
                EQ {value} => value,
                _ => &Null
            }
        });
        if let Some(eq_predicate) = eq_predicate {
            let program_pubkey = eq_predicate.as_array().unwrap()[0].as_str().unwrap();

            if let Ok(program_idl) = idl_downloader.download_idl(program_pubkey).await {
                idl_downloader.store_idl(program_pubkey, &program_idl).await.unwrap();
            }
        }
    }

    Ok(())
}