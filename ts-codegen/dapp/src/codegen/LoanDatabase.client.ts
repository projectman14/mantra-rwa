/**
* This file was automatically generated by @cosmwasm/ts-codegen@1.10.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/amino";
import { Addr, InstantiateMsg, ExecuteMsg, Uint64, QueryMsg, LoanInfos, LoanContract } from "./LoanDatabase.types";
export interface LoanDatabaseReadOnlyInterface {
  contractAddress: string;
  getLoans: ({
    borrower
  }: {
    borrower: Addr;
  }) => Promise<LoanInfos>;
}
export class LoanDatabaseQueryClient implements LoanDatabaseReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;
  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.getLoans = this.getLoans.bind(this);
  }
  getLoans = async ({
    borrower
  }: {
    borrower: Addr;
  }): Promise<LoanInfos> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_loans: {
        borrower
      }
    });
  };
}
export interface LoanDatabaseInterface extends LoanDatabaseReadOnlyInterface {
  contractAddress: string;
  sender: string;
  mintLoanContract: ({
    borrowedAmount,
    borrower,
    daysBeforeExpiration,
    interest,
    tokenUri
  }: {
    borrowedAmount: Uint64;
    borrower: Addr;
    daysBeforeExpiration: number;
    interest: Uint64;
    tokenUri: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  changeLoanContractStatus: ({
    borrower,
    statusCode
  }: {
    borrower: Addr;
    statusCode: Uint64;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  addTokenAddress: ({
    address
  }: {
    address: Addr;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  changeMinter: ({
    minter
  }: {
    minter: number;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
}
export class LoanDatabaseClient extends LoanDatabaseQueryClient implements LoanDatabaseInterface {
  then(arg0: (info: any) => Promise<void>) {
    throw new Error('Method not implemented.');
  }
  declare client: SigningCosmWasmClient;
  sender: string;
  declare contractAddress: string;
  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.mintLoanContract = this.mintLoanContract.bind(this);
    this.changeLoanContractStatus = this.changeLoanContractStatus.bind(this);
    this.addTokenAddress = this.addTokenAddress.bind(this);
    this.changeMinter = this.changeMinter.bind(this);
  }
  mintLoanContract = async ({
    borrowedAmount,
    borrower,
    daysBeforeExpiration,
    interest,
    tokenUri
  }: {
    borrowedAmount: Uint64;
    borrower: Addr;
    daysBeforeExpiration: number;
    interest: Uint64;
    tokenUri: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      mint_loan_contract: {
        borrowed_amount: borrowedAmount,
        borrower,
        days_before_expiration: daysBeforeExpiration,
        interest,
        token_uri: tokenUri
      }
    }, fee, memo, _funds);
  };
  changeLoanContractStatus = async ({
    borrower,
    statusCode
  }: {
    borrower: Addr;
    statusCode: Uint64;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      change_loan_contract_status: {
        borrower,
        status_code: statusCode
      }
    }, fee, memo, _funds);
  };
  addTokenAddress = async ({
    address
  }: {
    address: Addr;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      add_token_address: {
        address
      }
    }, fee, memo, _funds);
  };
  changeMinter = async ({
    minter
  }: {
    minter: number;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      change_minter: {
        minter
      }
    }, fee, memo, _funds);
  };
}