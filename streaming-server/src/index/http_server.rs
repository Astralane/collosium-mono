use std::sync::Arc;

use actix_web::{App, Error, HttpResponse, HttpServer, web};
use sqlx::{Pool, Postgres};
use tokio::sync::Mutex;
use uuid::Uuid;

use crate::ldb::solana_instructions;

use super::parser::IndexConfiguration;

#[derive(Clone)]
struct DataWrapper {
    db: Arc<Mutex<Pool<Postgres>>>,
    index_configs: Arc<Mutex<Vec<IndexConfiguration>>>,
}

pub struct Indexer {
    server: IndexerHttpServer,
    data: DataWrapper,
}
struct IndexerHttpServer {
    port: i16,
}

impl Indexer {
    pub async fn new(db_pool: Arc<Mutex<Pool<Postgres>>>,
                     index_configs: Arc<Mutex<Vec<IndexConfiguration>>>) -> Self {
        Self {
            server: IndexerHttpServer::new(9696),
            data: DataWrapper { db: db_pool, index_configs },
        }
    }

    pub async fn start(&self) {
        self.server.start(self.data.clone()).await;
    }
}

impl IndexerHttpServer {
    pub fn new(port: i16) -> Self {
        Self { port }
    }
    pub async fn start(&self, db: DataWrapper) {
        let addr = format!("127.0.0.1:{}", self.port);
        println!("starting http server at http://{0}:{1}", "localhost", self.port);
        let server = HttpServer::new(move || {
            App::new()
                .app_data(web::Data::new(db.clone()))
                .service(web::resource("/index").route(web::post().to(Self::create_new_index)))
        })
            .bind(addr)
            .unwrap()
            .run();
        server.await.expect("http server failed to start");
    }

    async fn create_new_index(
        mut raw_data: web::Json<IndexConfiguration>,
        data: web::Data<DataWrapper>,
    ) -> Result<HttpResponse, Error> {
        let json_config = serde_json::to_string(&raw_data).unwrap();
        let mut connection = data.db.lock().await.acquire().await.unwrap();

        let access_key = Uuid::new_v4();
        let access_key_underscored = access_key.to_string().replace("-", "_");
        raw_data.table_name = format!("index_{access_key_underscored}");
        let res = sqlx::query(
            "insert into index_configuration (access_key, table_name, json_config) \
                    values ($1, $2, $3)",
        )
            .bind(access_key)
            .bind(&raw_data.table_name)
            .bind(sqlx::types::Json(json_config))
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

        let mut configs = data.index_configs.lock().await;
        configs.push(raw_data.0);

        Ok(HttpResponse::Ok().json(format!("{}", access_key)))
    }
}