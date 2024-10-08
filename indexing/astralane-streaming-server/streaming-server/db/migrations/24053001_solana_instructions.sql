create table solana_instructions(
    block_slot bigint,
    tx_id varchar,
    tx_index bigint,
    program_id varchar,
    is_inner boolean,
    data varchar,
    account_arguments varchar[],
    tx_signer varchar,
    tx_success boolean
);