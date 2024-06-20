# Astraline Admin Server

## Running

### 1. Start MongoDB

MongoDB required to run this server, use following command to start:
```bash
docker run \
  --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  -p 27017:27017 \
  mongo
```


### 2. Configure .env

Clone `.env.example` file to the `.env` file and fill out variables

### 3. Run 

```
npm start
```
