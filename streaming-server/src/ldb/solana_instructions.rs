use solana_sdk::bs58;

use astraline_streaming_server::Result;
use jito_protos::solana::geyser::{TimestampedTransactionUpdate, TransactionUpdate};
use jito_protos::solana::storage::confirmed_block::{ConfirmedTransaction, Message, Transaction, TransactionStatusMeta};

use crate::index::parser::IndexFilterPredicate;

pub(crate) struct SolanaInstruction {
    block_slot: u64,
    tx_id: String,
    tx_index: u64,
    program_id: String,
    is_inner: bool,
    data: String,
    account_arguments: Vec<String>,
    tx_signer: String,
    tx_success: bool,
}

// value, type
pub(crate) enum SolanaInstructionsColumn {
    BlockSlot(u64),
    TxId(String),
    TxIndex(u64),
    ProgramId(String),
    IsInner(bool),
    Data(String),
    AccountArguments(Vec<String>),
    TxSigner(String),
    TxSuccess(bool)
}


impl SolanaInstructionsColumn {
    pub fn check(&self, filter_predicate: &IndexFilterPredicate) -> bool {
        return match self {
            SolanaInstructionsColumn::BlockSlot(block_slot) => {
                match filter_predicate {
                    IndexFilterPredicate::LT { value } => {
                        let value: u64 = value.parse::<u64>().unwrap();
                        *block_slot < value
                    }
                    IndexFilterPredicate::GT { value } => {
                        let value: u64 = value.parse::<u64>().unwrap();
                        *block_slot > value
                    }
                    IndexFilterPredicate::EQ { value } => {
                        let value: u64 = value.parse::<u64>().unwrap();
                        *block_slot == value
                    }
                    IndexFilterPredicate::IN { value } => {
                        for item in value {
                            let value: u64 = item.parse::<u64>().unwrap();
                            if *block_slot == value {
                                return true
                            }
                        }
                        false
                    }
                    IndexFilterPredicate::CONTAINS { value } => {
                        let value: u64 = value.parse::<u64>().unwrap();
                        *block_slot == value
                    }
                }
            }
            SolanaInstructionsColumn::ProgramId(program_id) => {
                match filter_predicate {
                    IndexFilterPredicate::LT {value: _value } => false,
                    IndexFilterPredicate::GT {value: _value } => false,
                    IndexFilterPredicate::EQ { value } => *program_id == *value,
                    IndexFilterPredicate::IN { value } => {
                        for item in value {
                            if *program_id == *item {
                                return true
                            }
                        }
                        false
                    }
                    IndexFilterPredicate::CONTAINS { value } => *program_id == *value,
                }
            }
            SolanaInstructionsColumn::AccountArguments(account_arguments) => {
                match filter_predicate {
                    IndexFilterPredicate::LT {value: _value } => false,
                    IndexFilterPredicate::GT {value: _value } => false,
                    IndexFilterPredicate::EQ { value } => {
                        return account_arguments.len() == 1 && account_arguments[0] == *value
                    }
                    IndexFilterPredicate::IN { value: _value } => false,
                    IndexFilterPredicate::CONTAINS { value } => {
                        account_arguments.contains(value)
                    }
                }
            }
            _ => false
        }
    }
}

pub(crate) fn parse_instruction(value: &TimestampedTransactionUpdate) -> Vec<SolanaInstruction> {
    match value {
        TimestampedTransactionUpdate {
            transaction: Some(TransactionUpdate  {
                                  slot,
                                  signature,
                                  is_vote: false,
                                  tx_idx,
                                  tx: Some(ConfirmedTransaction {
                                               transaction: Some(Transaction {
                                                                     message: Some(Message {
                                                                                       account_keys,
                                                                                       instructions,
                                                                                       ..
                                                                                   }, ..), ..
                                                                 }),
                                               meta: Some(TransactionStatusMeta {
                                                              err,
                                                              inner_instructions,
                                                              ..
                                                          })
                                           })
                              }), ..
        } => {
            let mut result = vec![];

            let block_slot = *slot;
            let tx_index = *tx_idx;
            let tx_success = err.is_none();

            let mut push_instruction = |program_id_index: usize, accounts: &Vec<u8>, data: &Vec<u8>| {
                let tx_id = signature.clone();

                let program_id = &account_keys[program_id_index];
                let program_id = bs58::encode(program_id).into_string();

                let data = bs58::encode(data).into_string();

                let account_arguments: Vec<String> = accounts.iter()
                    .map(
                        |account_index| {
                            let account_index = *account_index as usize;
                            let account = bs58::encode(&account_keys[account_index]).into_string();
                            account
                        }
                    )
                    .collect();

                let tx_signer = account_arguments[0].clone();

                result.push(SolanaInstruction {
                    block_slot,
                    tx_id,
                    tx_index,
                    program_id,
                    is_inner: false,
                    data,
                    account_arguments,
                    tx_signer,
                    tx_success,
                })
            };

            for instruction in instructions {
                push_instruction(instruction.program_id_index as usize, &instruction.accounts, &instruction.data);
            }

            for instructions in inner_instructions {
                for inner_instruction in &instructions.instructions {
                    push_instruction(inner_instruction.program_id_index as usize, &inner_instruction.accounts, &inner_instruction.data);
                }
            }
            result
        }
        _ => {
            return vec![];
        }
    }
}

pub(crate) fn parse_column(column_name: &str, instruction: &SolanaInstruction) -> Result<SolanaInstructionsColumn> {
    match column_name {
        "block_slot" => Ok(SolanaInstructionsColumn::BlockSlot(instruction.block_slot)),
        "tx_id" => Ok(SolanaInstructionsColumn::TxId(instruction.tx_id.clone())),
        "tx_index" => Ok(SolanaInstructionsColumn::TxIndex(instruction.tx_index)),
        "program_id" => Ok(SolanaInstructionsColumn::ProgramId(instruction.program_id.clone())),
        "is_inner" => Ok(SolanaInstructionsColumn::IsInner(instruction.is_inner)),
        "data" => Ok(SolanaInstructionsColumn::Data(instruction.data.clone())),
        "account_arguments" => Ok(SolanaInstructionsColumn::AccountArguments(instruction.account_arguments.clone())),
        "tx_signer" => Ok(SolanaInstructionsColumn::TxSigner(instruction.tx_signer.clone())),
        "tx_success" => Ok(SolanaInstructionsColumn::TxSuccess(instruction.tx_success)),
        &_ => {
            Err(format!("Unknown column name {column_name}"))
        }
    }
}

pub(crate) fn column_type(column_name: &str) -> Result<String> {
    match column_name {
        "block_slot" => Ok(String::from("bigint")),
        "tx_id" => Ok(String::from("text")),
        "tx_index" => Ok(String::from("bigint")),
        "program_id" => Ok(String::from("text")),
        "is_inner" => Ok(String::from("boolean")),
        "data" => Ok(String::from("text")),
        "account_arguments" => Ok(String::from("text[]")),
        "tx_signer" => Ok(String::from("text")),
        "tx_success" => Ok(String::from("boolean")),
        &_ => {
            Err(format!("Unknown column name {column_name}"))
        }
    }
}