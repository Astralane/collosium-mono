# Genrate proto files

#### From a pre-built `.spkg`

If you have an `.spkg` that already contains your Protobuf definitions, you can use it directly. It contains Substreams system Protobuf definitions so you can generate everything in one shot:

```bash
buf generate --exclude-path="google,sf/substreams" https://spkg.io/topledger/tl-solana-dex-trades-1-0-13-v1.0.13.spkg#format=bin
```

> **Note** An `.spkg` contains recursively all Proto definitions, some you may not desire. You can exclude generation of some element via `--exclude-path="google"` flag. You can specify many separated by a comma.
