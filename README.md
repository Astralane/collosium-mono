# Astraline GraphQL Server

## Running

### 1. Configure .env

Create .env file. 
To run on local machine provide the next variables:
```
POSTGRES_PORT=5434
POSTGRES_DB_NAME=postgres
POSTGRES_USER_NAME=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=172.17.0.1
LISTEN_PORT=3001

ADMIN_SERVICE_API_URL=http://172.17.0.1:3002
```
Or copy from .env.example

### 3. Start in Docker
```
docker build -t graph_ql_service .
docker run --env-file .env -p 3001:3001 graph_ql_service
```
