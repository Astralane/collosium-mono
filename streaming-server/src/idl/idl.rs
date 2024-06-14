use std::io::Read;
use std::str::FromStr;
use std::sync::Arc;

use borsh::{BorshDeserialize, BorshSerialize, from_slice};
use flate2::read::ZlibDecoder;
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_program::pubkey::Pubkey;
use sqlx::{Pool, Postgres};
use tokio::sync::Mutex;

use astraline_streaming_server::Result;

#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug)]
struct IdlProgramAccount {
    authority: Pubkey,
    data: Vec<u8>,
}

const ANCHOR_SEED: &str = "anchor:idl";
const ANCHOR_ACCOUNT_DISCRIMINATOR_LENGTH: usize = 8;
const STORE_IDL_SQL: &str =
"INSERT INTO program_idl (program_pubkey, idl)
VALUES ($1, $2)
ON CONFLICT (program_pubkey)
    DO UPDATE SET idl = EXCLUDED.idl";


pub struct IDLDownloader {
    rpc_client: RpcClient,
    db_pool: Arc<Mutex<Pool<Postgres>>>,
}

impl IDLDownloader {
    pub fn new(rpc_url: &str, db_pool: Arc<Mutex<Pool<Postgres>>>) -> Self {
        IDLDownloader {
            rpc_client: RpcClient::new(String::from(rpc_url)),
            db_pool,
        }
    }

    pub async fn download_idl(&self, program_pubkey: &str) -> Result<String> {
        let program_pubkey = Pubkey::from_str(program_pubkey).map_err(|e| {
            format!("failed to parse program_pubkey: {e}")
        })?;
        let base = Pubkey::find_program_address(&[], &program_pubkey).0;

        let anchor_pubkey = Pubkey::create_with_seed(&base, ANCHOR_SEED, &program_pubkey).map_err(|e| {
            format!("failed to create anchor_pubkey: {e}")
        })?;

        let account_data =  self.rpc_client.get_account(&anchor_pubkey).await.map_err(|e| {
            format!("failed to get account_data from rpc: {e}")
        })?.data;

        let data_len_start = ANCHOR_ACCOUNT_DISCRIMINATOR_LENGTH + std::mem::size_of::<Pubkey>();
        let data_len_end = data_len_start + 4;
        let data_len = from_slice::<u32>(&account_data[data_len_start..data_len_end]).map_err(|e| {
            format!("failed to get decode idl data len blob: {e}")
        })? as usize;

        let data = from_slice::<Vec<u8>>(&account_data[data_len_start..data_len_end + data_len]).map_err(|e| {
            format!("failed to get decode idl data blob: {e}")
        })?;

        let mut deflated_idl = ZlibDecoder::new(&data[..]);

        let mut idl_string = String::new();
        deflated_idl.read_to_string(&mut idl_string).map_err(|e| {
            format!("failed to defalate idl blob: {e}")
        })?;

        Ok(idl_string)
    }

    pub async fn store_idl(&self, program_pubkey: &str, idl: &str) -> Result<()> {
        let db_lock = &self.db_pool.lock().await;
        let mut connection = db_lock.acquire().await.unwrap();

        sqlx::query(STORE_IDL_SQL)
            .bind(program_pubkey)
            .bind(sqlx::types::Json(idl))
            .execute(&mut connection).await.map_err(|e| {
            format!("failed to store id to db: {e}")
        })?;

        Ok(())
    }
}