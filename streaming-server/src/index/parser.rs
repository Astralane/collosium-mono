#[cfg(test)]
use std::println as info;

use serde::{Deserialize, Serialize};
use serde_json::Value;
use crate::ldb::solana_instructions::{ContainsPredicate, EqPredicate, GtPredicate, InPredicate, LtPredicate, Predicate};

#[derive(Debug, Clone)]
pub struct IndexConfigurationUnparsed {
    pub json_config: String,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(tag = "type")]
pub enum IndexFilterPredicate {
    #[serde(rename(deserialize = "lt", serialize = "lt"))]
    LT { value: Value },
    #[serde(rename(deserialize = "gt", serialize = "gt"))]
    GT { value: Value },
    #[serde(rename(deserialize = "eq", serialize = "eq"))]
    EQ { value: Value },
    #[serde(rename(deserialize = "in", serialize = "in"))]
    IN { value: Vec<Value> },
    #[serde(rename(deserialize = "contains", serialize = "contains"))]
    CONTAINS { value: Vec<Value> },
}

impl IndexFilterPredicate {
    pub fn to_predicate(&self) -> Box<dyn Predicate<Value>> {
        match self {
            IndexFilterPredicate::LT { value } => Box::new(LtPredicate { threshold: value.clone() }),
            IndexFilterPredicate::GT { value } => Box::new(GtPredicate { threshold: value.clone() }),
            IndexFilterPredicate::EQ { value } => Box::new(EqPredicate { target: value.clone() }),
            IndexFilterPredicate::IN { value } => Box::new(InPredicate { set: value.clone() }),
            IndexFilterPredicate::CONTAINS { value } => Box::new(ContainsPredicate { elements: value.clone() }),
        }
    }
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct IndexFilterEntity {
    pub column: String,
    pub predicates: Vec<IndexFilterPredicate>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct IndexConfiguration {
    pub name: String,
    pub table_name: String,
    pub columns: Vec<String>,
    pub filters: Vec<IndexFilterEntity>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct IndexConfigurationDTO {
    pub name: String,
    pub columns: Vec<String>,
    pub filters: Vec<IndexFilterEntity>,
}

/* example:
    vec![IndexConfiguration {
        name: String::from("test"),
        table_name: String::from("mich_test"),
        columns: vec![String::from("block_slot"), String::from("program_id")],
        filters: vec![
            IndexFilterEntity {
                column: String::from("block_slot"),
                predicates: vec![IndexFilterPredicate::GT {value: String::from("111792")}]
            },
            IndexFilterEntity {
                column: String::from("program_id"),
                predicates: vec![IndexFilterPredicate::IN {value: vec![String::from("11111111111111111111111111111111")]}]
            },
            IndexFilterEntity {
                column: String::from("account_arguments"),
                predicates: vec![IndexFilterPredicate::CONTAINS {value: String::from("72i21TqCQw6oTGULXHNmuHkyrzyjbsGVdem1f4mUnAMJ")}]
            },
        ]
    }]
     */

#[test]
fn test_parsing() {
    let json = r#"{
    "name": "All Memos from 09:10:00 to 09:11:40",
    "table_name": "test_table",
    "columns": [
        "block_slot",
        "tx_id",
        "tx_index",
        "program_id",
        "is_inner",
        "data",
        "account_arguments",
        "tx_signer",
        "tx_success"
    ],
    "filters": [
        {
            "column": "account_arguments",
            "predicates": [
                {
                    "type": "lt",
                    "value": ["4dv4puYib9XZXHrTN5csFxzfWKSmetTu1dLsJWNNV2XZ"]
                }
            ]
        }
    ]
}"#;
    let res: IndexConfiguration = serde_json::from_str(&*String::from(json)).unwrap();
    info!("{:?}", res);
}
