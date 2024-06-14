use std::collections::HashMap;
use std::hash::Hash;
use lazy_static::lazy_static;
use astraline_streaming_server::Result;

lazy_static! {
    static ref STANDARD_COLUMNS: HashMap<String, String> = {
        let mut m = HashMap::new();
        m.insert(String::from("block_slot"), String::from("text"));
        m.insert(String::from("tx_id"), String::from("text"));
        m.insert(String::from("tx_index"), String::from("text"));
        m.insert(String::from("program_id"), String::from("text"));
        m.insert(String::from("is_inner"), String::from("text"));
        m.insert(String::from("data"), String::from("text"));
        m.insert(String::from("account_arguments"), String::from("text"));
        m.insert(String::from("tx_signer"), String::from("text"));
        m.insert(String::from("tx_success"), String::from("text"));
        m
    };
}

pub(crate) fn is_custom_column(column_name: &str) -> bool {
    if let Some(_) = STANDARD_COLUMNS.get(column_name) {
        return false
    }
    true
}

pub(crate) fn column_type(column_name: &str) -> Result<String> {
    if let Some(column_type) = STANDARD_COLUMNS.get(column_name) {
        Ok(String::from(column_type))
    } else {
        match_others(column_name)
    }
}

fn match_others(column_name: &str) -> Result<String> {
    match get_pattern(column_name) {
        "account_*" => Ok(String::from("text")),
        "instruction_name" => Ok(String::from("text")),
        _ => Err(format!("Unknown column name {column_name}")),
    }
}

fn get_pattern(column_name: &str) -> &str {
    if column_name.starts_with("account_") {
        "account_*"
    } else {
        column_name
    }
}