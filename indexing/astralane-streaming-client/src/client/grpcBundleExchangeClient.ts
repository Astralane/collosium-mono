import { ChannelCredentials } from '@grpc/grpc-js';
import { BundleExchangeClient } from '../grpcBundleClient/bundle_exchange';

const GRPC_BUNDLE_EXCHANGE_SERVICE_ADDRESS =
  process.env.GRPC_BUNDLE_EXCHANGE_SERVICE_ADDRESS || 'localhost:50051';

const bundleExchangeClient = new BundleExchangeClient(
  GRPC_BUNDLE_EXCHANGE_SERVICE_ADDRESS,
  ChannelCredentials.createInsecure(),
);

export default bundleExchangeClient;
