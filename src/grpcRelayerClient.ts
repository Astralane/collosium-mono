import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from 'src/types/relayer/relayer';

const RELAYER_PROTO_PATH = 'src/proto/relayer/relayer.proto';

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
  'localhost:?????',
  grpc.credentials.createInsecure(),
);

export default relayerClient;
