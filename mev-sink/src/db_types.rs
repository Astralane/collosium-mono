use crate::sf::solana::dex::sandwiches::v1::Sandwich;
use crate::sf::solana::transfer::v1::SystemTransfer;
use clickhouse::Row;
use serde::{Deserialize, Serialize};

#[derive(Debug, Default, Serialize, Deserialize, Row)]
pub struct SandwichRow {
    pub frontrun_tx_id: String,
    pub slot: u64,
    pub backrun_tx_id: String,

    //frontrun
    #[serde(rename = "frontrun_swaps.block_slot")]
    pub frontrun_swaps_block_slot: Vec<u64>,
    #[serde(rename = "frontrun_swaps.tx_id")]
    pub frontrun_swaps_tx_id: Vec<String>,
    #[serde(rename = "frontrun_swaps.signer")]
    pub frontrun_swaps_signer: Vec<String>,
    #[serde(rename = "frontrun_swaps.pool_address")]
    pub frontrun_swaps_pool_address: Vec<String>,
    #[serde(rename = "frontrun_swaps.token_in")]
    pub frontrun_swaps_token_in: Vec<String>,
    #[serde(rename = "frontrun_swaps.token_out")]
    pub frontrun_swaps_token_out: Vec<String>,
    #[serde(rename = "frontrun_swaps.amount_in")]
    pub frontrun_swaps_amount_in: Vec<f64>,
    #[serde(rename = "frontrun_swaps.amount_out")]
    pub frontrun_swaps_amount_out: Vec<f64>,
    #[serde(rename = "frontrun_swaps.tx_fee")]
    pub frontrun_swaps_tx_fee: Vec<u64>,
    #[serde(rename = "frontrun_swaps.multi_location")]
    pub frontrun_swaps_multi_location: Vec<String>,
    #[serde(rename = "frontrun_swaps.instruction_index")]
    pub frontrun_swaps_instruction_index: Vec<u32>,
    #[serde(rename = "frontrun_swaps.inner_instruction_index")]
    pub frontrun_swaps_inner_instruction_index: Vec<u32>,
    #[serde(rename = "frontrun_swaps.transaction_index")]
    pub frontrun_swaps_transaction_index: Vec<u32>,
    #[serde(rename = "frontrun_swaps.inner_program")]
    pub frontrun_swaps_inner_program: Vec<String>,
    #[serde(rename = "frontrun_swaps.outer_program")]
    pub frontrun_swaps_outer_program: Vec<String>,
    #[serde(rename = "frontrun_swaps.priority_fee")]
    pub frontrun_swaps_priority_fee: Vec<u64>,
    #[serde(rename = "frontrun_swaps.block_date")]
    pub frontrun_swaps_block_date: Vec<String>,

    //victim
    #[serde(rename = "victim_swaps.block_slot")]
    pub victim_swaps_block_slot: Vec<u64>,
    #[serde(rename = "victim_swaps.tx_id")]
    pub victim_swaps_tx_id: Vec<String>,
    #[serde(rename = "victim_swaps.signer")]
    pub victim_swaps_signer: Vec<String>,
    #[serde(rename = "victim_swaps.pool_address")]
    pub victim_swaps_pool_address: Vec<String>,
    #[serde(rename = "victim_swaps.token_in")]
    pub victim_swaps_token_in: Vec<String>,
    #[serde(rename = "victim_swaps.token_out")]
    pub victim_swaps_token_out: Vec<String>,
    #[serde(rename = "victim_swaps.amount_in")]
    pub victim_swaps_amount_in: Vec<f64>,
    #[serde(rename = "victim_swaps.amount_out")]
    pub victim_swaps_amount_out: Vec<f64>,
    #[serde(rename = "victim_swaps.tx_fee")]
    pub victim_swaps_tx_fee: Vec<u64>,
    #[serde(rename = "victim_swaps.multi_location")]
    pub victim_swaps_multi_location: Vec<String>,
    #[serde(rename = "victim_swaps.instruction_index")]
    pub victim_swaps_instruction_index: Vec<u32>,
    #[serde(rename = "victim_swaps.inner_instruction_index")]
    pub victim_swaps_inner_instruction_index: Vec<u32>,
    #[serde(rename = "victim_swaps.transaction_index")]
    pub victim_swaps_transaction_index: Vec<u32>,
    #[serde(rename = "victim_swaps.inner_program")]
    pub victim_swaps_inner_program: Vec<String>,
    #[serde(rename = "victim_swaps.outer_program")]
    pub victim_swaps_outer_program: Vec<String>,
    #[serde(rename = "victim_swaps.priority_fee")]
    pub victim_swaps_priority_fee: Vec<u64>,
    #[serde(rename = "victim_swaps.block_date")]
    pub victim_swaps_block_date: Vec<String>,

    //backrun
    #[serde(rename = "backrun_swaps.block_slot")]
    pub backrun_swaps_swaps_block_slot: Vec<u64>,
    #[serde(rename = "backrun_swaps.tx_id")]
    pub backrun_swaps_tx_id: Vec<String>,
    #[serde(rename = "backrun_swaps.signer")]
    pub backrun_swaps_signer: Vec<String>,
    #[serde(rename = "backrun_swaps.pool_address")]
    pub backrun_swaps_pool_address: Vec<String>,
    #[serde(rename = "backrun_swaps.token_in")]
    pub backrun_swaps_token_in: Vec<String>,
    #[serde(rename = "backrun_swaps.token_out")]
    pub backrun_swaps_token_out: Vec<String>,
    #[serde(rename = "backrun_swaps.amount_in")]
    pub backrun_swaps_amount_in: Vec<f64>,
    #[serde(rename = "backrun_swaps.amount_out")]
    pub backrun_swaps_amount_out: Vec<f64>,
    #[serde(rename = "backrun_swaps.tx_fee")]
    pub backrun_swaps_tx_fee: Vec<u64>,
    #[serde(rename = "backrun_swaps.multi_location")]
    pub backrun_swaps_multi_location: Vec<String>,
    #[serde(rename = "backrun_swaps.instruction_index")]
    pub backrun_swaps_instruction_index: Vec<u32>,
    #[serde(rename = "backrun_swaps.inner_instruction_index")]
    pub backrun_swaps_inner_instruction_index: Vec<u32>,
    #[serde(rename = "backrun_swaps.transaction_index")]
    pub backrun_swaps_transaction_index: Vec<u32>,
    #[serde(rename = "backrun_swaps.inner_program")]
    pub backrun_swaps_inner_program: Vec<String>,
    #[serde(rename = "backrun_swaps.outer_program")]
    pub backrun_swaps_outer_program: Vec<String>,
    #[serde(rename = "backrun_swaps.priority_fee")]
    pub backrun_swaps_priority_fee: Vec<u64>,
    #[serde(rename = "backrun_swaps.block_date")]
    pub backrun_swaps_block_date: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, Row)]
pub struct TransferRow {
    pub from: String,
    pub to: String,
    pub lamports: u64,
    pub slot: u64,
    pub tx_id: String,
    pub multi_location: String,
    pub instruction_index: u32,
    pub inner_instruction_index: u32,
    pub tx_fee: u64,
    pub transaction_index: u32,
}

impl From<Sandwich> for SandwichRow {
    fn from(value: Sandwich) -> Self {
        let mut sandwich_row = SandwichRow::default();
        sandwich_row.frontrun_tx_id = value.frontrun[0].tx_id.clone();
        sandwich_row.backrun_tx_id = value.backrun[0].tx_id.clone();
        sandwich_row.slot = value.frontrun[0].block_slot;

        let frontrun_swaps = value.frontrun;
        let victim_swaps = value.victim_swaps;
        let backrun_swaps = value.backrun;

        for frontrun_swap in frontrun_swaps {
            sandwich_row
                .frontrun_swaps_block_slot
                .push(frontrun_swap.block_slot);
            sandwich_row.frontrun_swaps_tx_id.push(frontrun_swap.tx_id);
            sandwich_row
                .frontrun_swaps_multi_location
                .push(frontrun_swap.multi_location);
            sandwich_row
                .frontrun_swaps_signer
                .push(frontrun_swap.signer);
            sandwich_row
                .frontrun_swaps_pool_address
                .push(frontrun_swap.pool_address);
            sandwich_row
                .frontrun_swaps_token_in
                .push(frontrun_swap.token_in);
            sandwich_row
                .frontrun_swaps_token_out
                .push(frontrun_swap.token_out);
            sandwich_row
                .frontrun_swaps_amount_in
                .push(frontrun_swap.amount_in);
            sandwich_row
                .frontrun_swaps_amount_out
                .push(frontrun_swap.amount_out);
            sandwich_row
                .frontrun_swaps_tx_fee
                .push(frontrun_swap.tx_fee);
            sandwich_row
                .frontrun_swaps_instruction_index
                .push(frontrun_swap.instruction_index);
            sandwich_row
                .frontrun_swaps_inner_program
                .push(frontrun_swap.inner_program);
            sandwich_row
                .frontrun_swaps_outer_program
                .push(frontrun_swap.outer_program);
            sandwich_row
                .frontrun_swaps_inner_instruction_index
                .push(frontrun_swap.inner_instruction_index);
            sandwich_row
                .frontrun_swaps_transaction_index
                .push(frontrun_swap.transaction_index);
            sandwich_row
                .frontrun_swaps_priority_fee
                .push(frontrun_swap.priority_fee);
            sandwich_row
                .frontrun_swaps_block_date
                .push(frontrun_swap.block_date);
        }
        for victim_swap in victim_swaps {
            sandwich_row
                .victim_swaps_block_slot
                .push(victim_swap.block_slot);
            sandwich_row.victim_swaps_tx_id.push(victim_swap.tx_id);
            sandwich_row
                .victim_swaps_multi_location
                .push(victim_swap.multi_location);
            sandwich_row.victim_swaps_signer.push(victim_swap.signer);
            sandwich_row
                .victim_swaps_pool_address
                .push(victim_swap.pool_address);
            sandwich_row
                .victim_swaps_token_in
                .push(victim_swap.token_in);
            sandwich_row
                .victim_swaps_token_out
                .push(victim_swap.token_out);
            sandwich_row
                .victim_swaps_amount_in
                .push(victim_swap.amount_in);
            sandwich_row
                .victim_swaps_amount_out
                .push(victim_swap.amount_out);
            sandwich_row.victim_swaps_tx_fee.push(victim_swap.tx_fee);
            sandwich_row
                .victim_swaps_instruction_index
                .push(victim_swap.instruction_index);
            sandwich_row
                .victim_swaps_inner_program
                .push(victim_swap.inner_program);
            sandwich_row
                .victim_swaps_outer_program
                .push(victim_swap.outer_program);
            sandwich_row
                .victim_swaps_inner_instruction_index
                .push(victim_swap.inner_instruction_index);
            sandwich_row
                .victim_swaps_transaction_index
                .push(victim_swap.transaction_index);
            sandwich_row
                .victim_swaps_priority_fee
                .push(victim_swap.priority_fee);
            sandwich_row
                .victim_swaps_block_date
                .push(victim_swap.block_date);
        }
        for backrun_swap in backrun_swaps {
            sandwich_row
                .backrun_swaps_swaps_block_slot
                .push(backrun_swap.block_slot);
            sandwich_row.backrun_swaps_tx_id.push(backrun_swap.tx_id);
            sandwich_row
                .backrun_swaps_multi_location
                .push(backrun_swap.multi_location);
            sandwich_row.backrun_swaps_signer.push(backrun_swap.signer);
            sandwich_row
                .backrun_swaps_pool_address
                .push(backrun_swap.pool_address);
            sandwich_row
                .backrun_swaps_token_in
                .push(backrun_swap.token_in);
            sandwich_row
                .backrun_swaps_token_out
                .push(backrun_swap.token_out);
            sandwich_row
                .backrun_swaps_amount_in
                .push(backrun_swap.amount_in);
            sandwich_row
                .backrun_swaps_amount_out
                .push(backrun_swap.amount_out);
            sandwich_row.backrun_swaps_tx_fee.push(backrun_swap.tx_fee);
            sandwich_row
                .backrun_swaps_instruction_index
                .push(backrun_swap.instruction_index);
            sandwich_row
                .backrun_swaps_inner_program
                .push(backrun_swap.inner_program);
            sandwich_row
                .backrun_swaps_outer_program
                .push(backrun_swap.outer_program);
            sandwich_row
                .backrun_swaps_inner_instruction_index
                .push(backrun_swap.inner_instruction_index);
            sandwich_row
                .backrun_swaps_transaction_index
                .push(backrun_swap.transaction_index);
            sandwich_row
                .backrun_swaps_priority_fee
                .push(backrun_swap.priority_fee);
            sandwich_row
                .backrun_swaps_block_date
                .push(backrun_swap.block_date);
        }
        sandwich_row
    }
}

impl From<SystemTransfer> for TransferRow {
    fn from(value: SystemTransfer) -> Self {
        TransferRow {
            from: value.from.clone(),
            to: value.to.clone(),
            lamports: value.lamports,
            slot: value.slot,
            tx_id: value.tx_id.clone(),
            multi_location: format!(
                "{}/{}/{}",
                value.tx_id, value.instruction_index, value.inner_instruction_index
            ),
            instruction_index: value.instruction_index,
            inner_instruction_index: value.inner_instruction_index,
            tx_fee: value.tx_fee,
            transaction_index: value.transaction_index,
        }
    }
}
