import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './types/geyser/geyser';
import path from 'path';

const GEYSER_PROTO_PATH = path.join(__dirname, '/proto/geyser/geyser.proto');
const GRPC_GEYSER_SERVER_ADDRESS =
  process.env.GRPC_GEYSER_SERVER_ADDRESS || 'localhost:10000';

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDefinition = protoLoader.loadSync(GEYSER_PROTO_PATH, options);
const proto = grpc.loadPackageDefinition(
  packageDefinition,
) as unknown as ProtoGrpcType;

const geyserClient = new proto.solana.geyser.Geyser(
  GRPC_GEYSER_SERVER_ADDRESS,
  grpc.credentials.createInsecure(),
);

export default geyserClient;
