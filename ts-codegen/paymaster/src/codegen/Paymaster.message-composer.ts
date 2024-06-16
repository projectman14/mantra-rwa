/**
* This file was automatically generated by @cosmwasm/ts-codegen@1.10.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { Coin } from "@cosmjs/amino";
import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { Addr, InstantiateMsg, ExecuteMsg, Uint64, Timestamp, Uint128, QueryMsg } from "./Paymaster.types";
export interface PaymasterMsg {
  contractAddress: string;
  sender: string;
  addPayment: ({
    amount,
    decimals,
    frequencyInDays,
    receiver,
    startDate,
    tokenAddress,
    tokenSymbol
  }: {
    amount: Uint64;
    decimals: number;
    frequencyInDays: number;
    receiver: Addr;
    startDate: Timestamp;
    tokenAddress: Addr;
    tokenSymbol: string;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  removePayment: ({
    paymentId
  }: {
    paymentId: Uint128;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  updatePaymentStatus: (_funds?: Coin[]) => MsgExecuteContractEncodeObject;
}
export class PaymasterMsgComposer implements PaymasterMsg {
  sender: string;
  contractAddress: string;
  constructor(sender: string, contractAddress: string) {
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.addPayment = this.addPayment.bind(this);
    this.removePayment = this.removePayment.bind(this);
    this.updatePaymentStatus = this.updatePaymentStatus.bind(this);
  }
  addPayment = ({
    amount,
    decimals,
    frequencyInDays,
    receiver,
    startDate,
    tokenAddress,
    tokenSymbol
  }: {
    amount: Uint64;
    decimals: number;
    frequencyInDays: number;
    receiver: Addr;
    startDate: Timestamp;
    tokenAddress: Addr;
    tokenSymbol: string;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          add_payment: {
            amount,
            decimals,
            frequency_in_days: frequencyInDays,
            receiver,
            start_date: startDate,
            token_address: tokenAddress,
            token_symbol: tokenSymbol
          }
        })),
        funds: _funds
      })
    };
  };
  removePayment = ({
    paymentId
  }: {
    paymentId: Uint128;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          remove_payment: {
            payment_id: paymentId
          }
        })),
        funds: _funds
      })
    };
  };
  updatePaymentStatus = (_funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          update_payment_status: {}
        })),
        funds: _funds
      })
    };
  };
}