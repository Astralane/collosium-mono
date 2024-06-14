use astraline_streaming_server::Result;

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
        "instruction_name" => Ok(String::from("text")),
        _ => match_by_pattern(column_name),
    }
}

fn match_by_pattern(column_name: &str) -> Result<String> {
    match get_pattern(column_name) {
        "account_*" => Ok(String::from("text")),
        _ => Err(format!("Unknown column name {column_name}")),
    }
}

fn get_pattern(column_name: &str) -> &str {
    if column_name.starts_with("account_") {
        "account_*"
    } else {
        ""
    }
}