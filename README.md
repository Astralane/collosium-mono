# Astraline Admin Server

## Running

### 1. Configure .env

Clone `.env.example` file and fill out variables

### 2. Start MongoDB

MongoDB required to run this server, use following command to start:
```bash
docker run -d \
  --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  -p 27017:27017 \
  mongo
```
