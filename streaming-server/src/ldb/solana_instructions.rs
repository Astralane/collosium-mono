use serde_json::Value;
use solana_sdk::bs58;

use astraline_streaming_server::Result;
use jito_protos::solana::geyser::{TimestampedTransactionUpdate, TransactionUpdate};
use jito_protos::solana::storage::confirmed_block::{
    ConfirmedTransaction, Message, Transaction, TransactionStatusMeta,
};

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

pub(crate) enum SolanaInstructionsColumn {
    BlockSlot(u64),
    TxId(String),
    TxIndex(u64),
    ProgramId(String),
    IsInner(bool),
    Data(String),
    AccountArguments(Vec<String>),
    TxSigner(String),
    TxSuccess(bool),
}

pub trait Predicate<T> {
    fn apply(&self, value: &T) -> bool;
}

pub struct LtPredicate {
    pub threshold: Value,
}

impl Predicate<Value> for LtPredicate {
    fn apply(&self, value: &Value) -> bool {
        if let (Some(threshold), Some(val)) = (self.threshold.as_f64(), value.as_f64()) {
            return val < threshold;
        }
        if let (Some(threshold), Some(val)) = (self.threshold.as_u64(), value.as_u64()) {
            return val < threshold;
        }
        if let (Some(threshold), Some(val)) = (self.threshold.as_i64(), value.as_i64()) {
            return val < threshold;
        }
        false
    }
}

pub struct GtPredicate {
    pub threshold: Value,
}

impl Predicate<Value> for GtPredicate {
    fn apply(&self, value: &Value) -> bool {
        if let (Some(threshold), Some(val)) = (self.threshold.as_f64(), value.as_f64()) {
            return val > threshold;
        }
        if let (Some(threshold), Some(val)) = (self.threshold.as_u64(), value.as_u64()) {
            return val > threshold;
        }
        if let (Some(threshold), Some(val)) = (self.threshold.as_i64(), value.as_i64()) {
            return val > threshold;
        }
        false
    }
}

pub struct EqPredicate {
    pub target: Value,
}

impl Predicate<Value> for EqPredicate {
    fn apply(&self, value: &Value) -> bool {
        value == &self.target
    }
}

pub struct InPredicate {
    pub set: Vec<Value>,
}

impl Predicate<Value> for InPredicate {
    fn apply(&self, value: &Value) -> bool {
        self.set.contains(value)
    }
}

pub struct ContainsPredicate {
    pub elements: Vec<Value>,
}

impl Predicate<Value> for ContainsPredicate {
    fn apply(&self, value: &Value) -> bool {
        if let Some(array) = value.as_array() {
            for element in &self.elements {
                if array.contains(element) {
                    return true;
                }
            }
        }
        false
    }
}

impl SolanaInstructionsColumn {
    pub fn check(&self, predicate: &dyn Predicate<Value>) -> bool {
        match self {
            SolanaInstructionsColumn::BlockSlot(block_slot) => {
                predicate.apply(&Value::from(*block_slot))
            }
            SolanaInstructionsColumn::TxId(tx_id) => predicate.apply(&Value::from(tx_id.clone())),
            SolanaInstructionsColumn::TxIndex(tx_index) => predicate.apply(&Value::from(*tx_index)),
            SolanaInstructionsColumn::ProgramId(program_id) => {
                predicate.apply(&Value::from(program_id.clone()))
            }
            SolanaInstructionsColumn::IsInner(is_inner) => predicate.apply(&Value::from(*is_inner)),
            SolanaInstructionsColumn::Data(data) => predicate.apply(&Value::from(data.clone())),
            SolanaInstructionsColumn::AccountArguments(account_arguments) => {
                let account_arguments_value = Value::Array(
                    account_arguments
                        .iter()
                        .map(|arg| Value::String(arg.clone()))
                        .collect(),
                );
                predicate.apply(&account_arguments_value)
            }
            SolanaInstructionsColumn::TxSigner(tx_signer) => {
                predicate.apply(&Value::from(tx_signer.clone()))
            }
            SolanaInstructionsColumn::TxSuccess(tx_success) => {
                predicate.apply(&Value::from(*tx_success))
            }
        }
    }
}

pub(crate) fn parse_instruction(value: &TimestampedTransactionUpdate) -> Vec<SolanaInstruction> {
    match value {
        TimestampedTransactionUpdate {
            transaction:
                Some(TransactionUpdate {
                    slot,
                    signature,
                    is_vote: false,
                    tx_idx,
                    tx:
                        Some(ConfirmedTransaction {
                            transaction:
                                Some(Transaction {
                                    message:
                                        Some(
                                            Message {
                                                account_keys,
                                                instructions,
                                                ..
                                            },
                                            ..,
                                        ),
                                    ..
                                }),
                            meta:
                                Some(TransactionStatusMeta {
                                    err,
                                    inner_instructions,
                                    ..
                                }),
                        }),
                }),
            ..
        } => {
            let mut result = vec![];

            let block_slot = *slot;
            let tx_index = *tx_idx;
            let tx_success = err.is_none();

            let mut push_instruction =
                |program_id_index: usize, accounts: &Vec<u8>, data: &Vec<u8>| {
                    let tx_id = signature.clone();

                    let program_id = &account_keys[program_id_index];
                    let program_id = bs58::encode(program_id).into_string();

                    let data = bs58::encode(data).into_string();

                    let account_arguments: Vec<String> = accounts
                        .iter()
                        .map(|account_index| {
                            let account_index = *account_index as usize;
                            let account = bs58::encode(&account_keys[account_index]).into_string();
                            account
                        })
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
                push_instruction(
                    instruction.program_id_index as usize,
                    &instruction.accounts,
                    &instruction.data,
                );
            }

            for instructions in inner_instructions {
                for inner_instruction in &instructions.instructions {
                    push_instruction(
                        inner_instruction.program_id_index as usize,
                        &inner_instruction.accounts,
                        &inner_instruction.data,
                    );
                }
            }
            result
        }
        _ => vec![],
    }
}

pub(crate) fn parse_column(
    column_name: &str,
    instruction: &SolanaInstruction,
) -> Result<SolanaInstructionsColumn> {
    match column_name {
        "block_slot" => Ok(SolanaInstructionsColumn::BlockSlot(instruction.block_slot)),
        "tx_id" => Ok(SolanaInstructionsColumn::TxId(instruction.tx_id.clone())),
        "tx_index" => Ok(SolanaInstructionsColumn::TxIndex(instruction.tx_index)),
        "program_id" => Ok(SolanaInstructionsColumn::ProgramId(
            instruction.program_id.clone(),
        )),
        "is_inner" => Ok(SolanaInstructionsColumn::IsInner(instruction.is_inner)),
        "data" => Ok(SolanaInstructionsColumn::Data(instruction.data.clone())),
        "account_arguments" => Ok(SolanaInstructionsColumn::AccountArguments(
            instruction.account_arguments.clone(),
        )),
        "tx_signer" => Ok(SolanaInstructionsColumn::TxSigner(
            instruction.tx_signer.clone(),
        )),
        "tx_success" => Ok(SolanaInstructionsColumn::TxSuccess(instruction.tx_success)),
        _ => Err(format!("Unknown column name {column_name}")),
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
        _ => Err(format!("Unknown column name {column_name}")),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::ldb::solana_instructions::SolanaInstructionsColumn;

    #[test]
    fn test_block_slot_predicates() {
        let column = SolanaInstructionsColumn::BlockSlot(1716973850);

        let gt_predicate = GtPredicate {
            threshold: Value::from(1716973800),
        };
        assert!(column.check(&gt_predicate));

        let lt_predicate = LtPredicate {
            threshold: Value::from(1716973900),
        };
        assert!(column.check(&lt_predicate));

        let eq_predicate = EqPredicate {
            target: Value::from(1716973850),
        };
        assert!(column.check(&eq_predicate));

        let in_predicate = InPredicate {
            set: vec![Value::from(1716973850), Value::from(1716973900)],
        };
        assert!(column.check(&in_predicate));
    }

    #[test]
    fn test_tx_id_predicates() {
        let column = SolanaInstructionsColumn::TxId("test_tx_id".to_string());
        let eq_predicate = EqPredicate {
            target: Value::from("test_tx_id".to_string()),
        };
        assert!(column.check(&eq_predicate));

        let in_predicate = InPredicate {
            set: vec![
                Value::from("test_tx_id".to_string()),
                Value::from("other_tx_id".to_string()),
            ],
        };
        assert!(column.check(&in_predicate));
    }

    #[test]
    fn test_tx_success_predicate() {
        let column = SolanaInstructionsColumn::TxSuccess(true);
        let eq_predicate = EqPredicate {
            target: Value::from(true),
        };
        assert!(column.check(&eq_predicate));
    }

    #[test]
    fn test_account_arguments_predicate() {
        let column = SolanaInstructionsColumn::AccountArguments(vec![
            "arg1".to_string(),
            "arg2".to_string(),
        ]);
        let contains_predicate = ContainsPredicate {
            elements: vec![Value::from("arg1".to_string())],
        };
        assert!(column.check(&contains_predicate));
    }
}
