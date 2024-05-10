import * as grpc from '@grpc/grpc-js';
import { GeyserClient } from '../grpc/geyser/geyser';

const GRPC_GEYSER_SERVER_ADDRESS =
  process.env.GRPC_GEYSER_SERVER_ADDRESS || 'localhost:10000';

const geyserClient = new GeyserClient(
  GRPC_GEYSER_SERVER_ADDRESS,
  grpc.credentials.createInsecure(),
);

export default geyserClient;
