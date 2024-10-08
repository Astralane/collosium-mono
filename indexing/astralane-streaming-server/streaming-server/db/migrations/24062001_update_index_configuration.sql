alter table index_configuration rename column access_key to index_id;
alter table index_configuration add column api_key text;