// Original file: src/geyser/confirmed_block.proto

import type { RewardType as _solana_storage_ConfirmedBlock_RewardType, RewardType__Output as _solana_storage_ConfirmedBlock_RewardType__Output } from './RewardType';
import type { Long } from '@grpc/proto-loader';

export interface Reward {
  'pubkey'?: (string);
  'lamports'?: (number | string | Long);
  'postBalance'?: (number | string | Long);
  'rewardType'?: (_solana_storage_ConfirmedBlock_RewardType);
  'commission'?: (string);
}

export interface Reward__Output {
  'pubkey': (string);
  'lamports': (string);
  'postBalance': (string);
  'rewardType': (_solana_storage_ConfirmedBlock_RewardType__Output);
  'commission': (string);
}
