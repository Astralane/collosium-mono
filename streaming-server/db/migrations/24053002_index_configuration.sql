create table index_configuration(
    id bigserial,
    table_name text,
    access_key uuid not null unique,
    json_config jsonb,
    last_updated_slot text
);