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

Create .env file. 
To run on local machine provide the next variables:
MONGODB_URL=mongodb://admin:secret@host.docker.internal:27017/admin-service?authSource=admin
PORT=3001

### 3. Start in Docker
```
docker build -t admin_service .
docker run --env-file .env -p 3001:3001 admin_service
```
