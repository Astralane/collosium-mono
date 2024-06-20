create table index_configuration(
    id bigserial,
    table_name text,
    index_id uuid not null unique,
    json_config jsonb,
    last_updated_slot text,
    api_key text
);