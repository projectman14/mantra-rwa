// Ensure you have the correct imports and exports
export * from './codegen';

import { contracts } from './codegen';
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

// Hardcoded values
const mnemonic = "fuel grunt humor output offer box bridge hover motor code spoon token have order grief medal sport bulk corn pave market insane access urge"; // Replace with your actual mnemonic
const rpcEndpoint = "https://rpc.hongbai.mantrachain.io"; // Replace with your actual RPC endpoint
let sender = "mantra1eqpxy66m8hr4v8njncg68p5melwlgq93kqt5nm";
let contractAddress = "mantra19u9j7yhj4ueqmnnw8xzw6ppxs4egugzuvljqqtx5ksrzfcaqp3uqxnrqpz";


// Create a wallet from the mnemonic
const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "mantra" });

// Initialize the SigningCosmWasmClient
const sc = await SigningCosmWasmClient.connectWithSigner(rpcEndpoint, wallet);

// Create an instance of PollingClient with the hardcoded values
const client = new contracts.LoanDatabase.LoanDatabaseClient(sc , sender , contractAddress);

const data = await client.getLoans({borrower: sender});



// const ext = await client.createPoll({ question: "Hello" });

export { data };



