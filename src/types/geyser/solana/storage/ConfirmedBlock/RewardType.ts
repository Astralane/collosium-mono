// Original file: src/geyser/confirmed_block.proto

export const RewardType = {
  Unspecified: 'Unspecified',
  Fee: 'Fee',
  Rent: 'Rent',
  Staking: 'Staking',
  Voting: 'Voting',
} as const;

export type RewardType =
  | 'Unspecified'
  | 0
  | 'Fee'
  | 1
  | 'Rent'
  | 2
  | 'Staking'
  | 3
  | 'Voting'
  | 4

export type RewardType__Output = typeof RewardType[keyof typeof RewardType]
