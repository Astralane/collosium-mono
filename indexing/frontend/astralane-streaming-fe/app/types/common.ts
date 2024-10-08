export type TbackfillStatus = {
  index_id: string;
  start_time?: string;
  update_time?: string;
  status: EBackfillStatus;
  percentage?: number;
  last_processed_block?: number;
  starting_block?: number;
};

export enum EBackfillStatus {
  "NOT_SARTED" = "not_started",
  "IN_PROGRESS" = "in_progress",
  "COMPLETED" = "completed",
}

export type TbackfillError = {
  error: string;
  message: string;
  statusCode: number;
};
