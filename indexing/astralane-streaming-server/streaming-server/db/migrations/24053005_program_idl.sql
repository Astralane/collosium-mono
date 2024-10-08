create table program_idl(
    id bigserial,
    program_pubkey text not null unique,
    idl jsonb
);