export * from './codegen';

import { contracts } from './codegen';

import { CosmWasmClient , SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { SigningStargateClient, StargateClient , GasPrice  } from "@cosmjs/stargate";
const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
const { assertIsBroadcastTxSuccess } = require("@cosmjs/stargate");

import { PaymasterfactoryClient , PaymasterfactoryQueryClient } from './codegen/Paymasterfactory.client';



const mnemonic = "sunny metal burger rotate enemy front duck unaware nerve obscure next safe inflict zebra master mean donkey hockey bamboo session soon melody believe tiger"; //your memonic
const contractAddress = "mantra163dn7sa2385k95p5ujjwv5vqazw3lgsghpatmtlchdcmnj6zfvgs8nk46q";

async function connect() {

    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "mantra" });
    const [{ address }] = await wallet.getAccounts();

    const rpcEndpoint = "https://rpc.hongbai.mantrachain.io"

    const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet);

    // console.log("Connected to node", await client.getChainId())
    // console.log("Account address:", address)

    return {client , address}
}


export async function getCosmWasmClient(
    rpcEndpoint: string,
    mnemonic: string | undefined,
    prefix: string
  ): Promise<CosmWasmClient> {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix });
    const [account] = await wallet.getAccounts();
    const client = await CosmWasmClient.connect(rpcEndpoint)
    return client ; 
  }


  async function getSigningCosmWasmClient(
    rpcEndpoint: string,
    mnemonic:string | undefined,
    prefix: string
  ): Promise<SigningCosmWasmClient> {
    // Create a wallet from the mnemonic
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix });
    const [account] = await wallet.getAccounts();
    
    // Connect to the blockchain with the signer
    const client = await SigningCosmWasmClient.connectWithSigner(
      rpcEndpoint,
      wallet,
      {
        gasPrice: GasPrice.fromString('0.0001uom'),
      }
    );

  
    return client;
  }


  export async function GetPaymasterAccountInfo() {
    const client = await getCosmWasmClient("https://rpc.hongbai.mantrachain.io" , mnemonic , "mantra");
    const dinonum = new PaymasterfactoryQueryClient(client , contractAddress);

    return dinonum;
  }

  export async function MakePayMasterAccount(senderAddress:string) {
    const client = await getSigningCosmWasmClient("https://rpc.hongbai.mantrachain.io" , mnemonic , "mantra");

    const dinonum = new PaymasterfactoryClient(client , senderAddress , contractAddress);

    return dinonum;
  }



