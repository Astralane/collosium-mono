// Original file: src/geyser/geyser.proto

export const SlotUpdateStatus = {
  CONFIRMED: 'CONFIRMED',
  PROCESSED: 'PROCESSED',
  ROOTED: 'ROOTED',
} as const;

export type SlotUpdateStatus =
  | 'CONFIRMED'
  | 0
  | 'PROCESSED'
  | 1
  | 'ROOTED'
  | 2

export type SlotUpdateStatus__Output = typeof SlotUpdateStatus[keyof typeof SlotUpdateStatus]
