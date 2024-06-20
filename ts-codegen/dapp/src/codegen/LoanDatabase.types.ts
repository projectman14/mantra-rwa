/**
* This file was automatically generated by @cosmwasm/ts-codegen@1.10.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

export type Addr = string;
export interface InstantiateMsg {
  admins: Addr[];
  minter: number;
}
export type ExecuteMsg = {
  mint_loan_contract: {
    borrowed_amount: Uint64;
    borrower: Addr;
    days_before_expiration: number;
    interest: Uint64;
    token_uri: string;
  };
} | {
  change_loan_contract_status: {
    borrower: Addr;
    status_code: Uint64;
  };
} | {
  add_token_address: {
    address: Addr;
  };
} | {
  change_minter: {
    minter: number;
  };
};
export type Uint64 = string;
export type QueryMsg = {
  get_loans: {
    borrower: Addr;
  };
};
export interface LoanInfos {
  contracts: LoanContract[];
}
export interface LoanContract {
  address: Addr;
  status_code: Uint64;
}