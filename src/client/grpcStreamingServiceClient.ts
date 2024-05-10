import * as grpc from '@grpc/grpc-js';
import { StreamingServiceClient } from 'src/grpc/streaming_service';

const GRPC_STREAMING_SERVICE_ADDRESS =
  process.env.GRPC_STREAMING_SERVICE_ADDRESS || 'localhost:20000';

const streamingClient = new StreamingServiceClient(
  GRPC_STREAMING_SERVICE_ADDRESS,
  grpc.credentials.createInsecure(),
);

export default streamingClient;
