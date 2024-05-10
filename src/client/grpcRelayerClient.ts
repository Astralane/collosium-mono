import * as grpc from '@grpc/grpc-js';
import { RelayerClient } from '../grpc/relayer/relayer';

const GRPC_RELAYER_SERVER_ADDRESS =
  process.env.GRPC_RELAYER_SERVER_ADDRESS || 'localhost:11226';

const relayerClient = new RelayerClient(
  GRPC_RELAYER_SERVER_ADDRESS,
  grpc.credentials.createInsecure(),
);

export default relayerClient;
