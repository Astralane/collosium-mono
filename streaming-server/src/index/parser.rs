#[cfg(test)]
use std::println as info;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone)]
pub struct IndexConfigurationUnparsed {
    pub json_config: String,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(tag = "type")]
pub enum IndexFilterPredicate {
    #[serde(rename(deserialize = "lt", serialize = "lt"))]
    LT { value: String },
    #[serde(rename(deserialize = "gt", serialize = "gt"))]
    GT { value: String },
    #[serde(rename(deserialize = "eq", serialize = "eq"))]
    EQ { value: String },
    #[serde(rename(deserialize = "in", serialize = "in"))]
    IN { value: Vec<String> },
    #[serde(rename(deserialize = "contains", serialize = "contains"))]
    CONTAINS { value: String },
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

#[test]
fn test_parsing() {
    let json = r#"{
    "name": "All Memos from 09:10:00 to 09:11:40",
    "table_name": "test_table",
    "columns": [
        "block_height",
        "tx_index",
        "inner_instruction_index",
        "program_id",
        "account_arguments",
        "data"
    ],
    "filters": [
        {
            "column": "block_time",
            "predicates": [
                {
                    "type": "gt",
                    "value": "1716973800"
                },
                {
                    "type": "lt",
                    "value": "1716973900"
                }
            ]
        },
        {
            "column": "program_id",
            "predicates": [
                {
                    "type": "eq",
                    "value": "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
                }
            ]
        }
    ]
}"#;
    let res: IndexConfiguration = serde_json::from_str(&*String::from(json)).unwrap();
    info!("{:?}", res);
}