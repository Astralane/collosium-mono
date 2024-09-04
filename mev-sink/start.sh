RUST_LOG=info && cargo run --release -- \
--db-url="https://jgefxgrwoy.asia-southeast1.gcp.clickhouse.cloud:8443" \
--db-user="default" \
--db-password="ULnKMtwmpGC9~" \
--db-database="default" \
--package="solana-mev-substream-v1.0.1.spkg" \
--from=281756256 \
--to=282188255