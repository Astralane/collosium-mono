export interface ActionInfo {
  swapper?: string;
  tokens_swapped?: {
    in?: {
      token_address?: string;
      name?: string;
      symbol?: string;
      image_uri?: string;
      amount?: number;
      amount_raw?: number;
    };
    out?: {
      token_address?: string;
      name?: string;
      symbol?: string;
      image_uri?: string;
      amount?: number;
      amount_raw?: number;
    };
  };
  swaps?: Array<{
    liquidity_pool_address?: string;
    name?: string;
    source?: string;
    in?: {
      token_address?: string;
      name?: string;
      symbol?: string;
      image_uri?: string;
      amount?: number;
      amount_raw?: number;
    };
    out?: {
      token_address?: string;
      name?: string;
      symbol?: string;
      image_uri?: string;
      amount?: number;
      amount_raw?: number;
    };
  }>;
  slippage_in_percent?: number | null;
  quoted_out_amount?: number | null;
  slippage_paid?: number | null;
}

export interface Action {
  type: string;
  info: ActionInfo;
  source_protocol?: {
    address?: string;
    name?: string;
  };
  parent_protocol?: string;
  ix_index?: number;
}

export interface Result {
  timestamp?: string;
  fee?: number;
  fee_payer: string;
  signers?: string[];
  signatures?: string[];
  protocol?: {
    address?: string;
    name?: string;
  };
  type?: string;
  status?: string;
  actions: Action[];
  events?: any[];
}

export interface ParsedData {
  success: boolean;
  message: string;
  result: Result[];
}

export interface ParsedResponse {
  [key: string]: ActionInfo;
}

export type MergedTx = {
  slot?: number;
  frontRunData: {
    signature: string;
    data: ActionInfo;
  };
  backRunData: {
    signature: string;
    data: ActionInfo;
  };
} & TMevResult;

export type TMevResult = {
  front_run: string;
  backrun: string;
  victims: string[];
  attacker: string;
};

export type ParsedTx = {
  [key: string]: ActionInfo;
};

export type TFinalParsed = {
  slot: number;
  data: MergedTx[];
};
