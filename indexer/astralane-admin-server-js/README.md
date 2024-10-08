# Astraline Admin Server

## Running

### 1. Start Postgres DB

MongoDB required to run this server, use following command to start:
```
docker run -p 5434:5432 --name postgres -e POSTGRES_PASSWORD=postgres -d postgres

```


### 2. Configure .env

Create .env file. 
To run on local machine provide the next variables:
```
PORT=3002
DATABASE_HOST=host.docker.internal
DATABASE_PORT=5434
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=postgres
RPC_NODE_URL=http://127.0.0.1:8899

```

### 3. Start in Docker
```
docker build -t admin_service .
docker run --env-file .env -p 3002:3002 admin_service
```
