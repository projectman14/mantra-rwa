export type Uint64 = string;
export type Addr = string;
export interface InstantiateMsg {
  borrowed_amount: Uint64;
  borrower: Addr;
  database_address: Addr;
  days_before_expiration: number;
  interest: Uint64;
  token_uri: string;
}
export type ExecuteMsg = {
  accept_payment: {
    payment: Uint64;
  };
} | {
  update_status: {};
};
export type QueryMsg = {
  get_details: {};
} | {
  remaining_payment: {};
};
export type Timestamp = Uint64;
export interface ContractInfo {
  borrowed_amount: Uint64;
  borrower: Addr;
  currently_paid: Uint64;
  expiration_date: Timestamp;
  interest: Uint64;
  start_date: Timestamp;
  status_code: Uint64;
  token_uri: string;
}