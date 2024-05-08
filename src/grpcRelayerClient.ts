import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './types/relayer/relayer';
import path from 'path';

const RELAYER_PROTO_PATH = path.join(__dirname, '/proto/relayer/relayer.proto');
const GRPC_RELAYER_SERVER_ADDRESS =
  process.env.GRPC_RELAYER_SERVER_ADDRESS || 'localhost:11226';

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDefinition = protoLoader.loadSync(RELAYER_PROTO_PATH, options);
const proto = grpc.loadPackageDefinition(
  packageDefinition,
) as unknown as ProtoGrpcType;

const relayerClient = new proto.relayer.Relayer(
  GRPC_RELAYER_SERVER_ADDRESS,
  grpc.credentials.createInsecure(),
);

export default relayerClient;
