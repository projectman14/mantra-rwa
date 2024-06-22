/**
* This file was automatically generated by @cosmwasm/ts-codegen@1.10.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { Coin } from "@cosmjs/amino";
import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { InstantiateMsg, ExecuteMsg, Addr, QueryMsg } from "./Paymasterfactorynew.types";
export interface PaymasterfactorynewMsg {
  contractAddress: string;
  sender: string;
  mintPaymasterAccount: ({
    address
  }: {
    address: Addr;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
}
export class PaymasterfactorynewMsgComposer implements PaymasterfactorynewMsg {
  sender: string;
  contractAddress: string;
  constructor(sender: string, contractAddress: string) {
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.mintPaymasterAccount = this.mintPaymasterAccount.bind(this);
  }
  mintPaymasterAccount = ({
    address
  }: {
    address: Addr;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          mint_paymaster_account: {
            address
          }
        })),
        funds: _funds
      })
    };
  };
}