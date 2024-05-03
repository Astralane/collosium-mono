import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './types/geyser/geyser';

const GEYSER_PROTO_PATH = 'src/proto/geyser/geyser.proto';

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
  'localhost:10000',
  grpc.credentials.createInsecure(),
);

export default geyserClient;
