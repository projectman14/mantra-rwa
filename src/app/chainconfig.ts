import { Chain, AssetList } from "@chain-registry/types";

export const mantra: Chain = {
    chain_name: "mantrachaintestnet",
    status: "active",
    network_type: "testnet",
    pretty_name: "MANTRA Chain Testnet",
    chain_id: "mantra-hongbai-1",
    website: "https://www.mantrachain.io",
    bech32_prefix: "mantra",
    bech32_config: {
        bech32PrefixAccAddr: "mantra",
        bech32PrefixAccPub: "mantrapub",
        bech32PrefixValAddr: "mantravaloper",
        bech32PrefixValPub: "mantravaloperpub",
        bech32PrefixConsAddr: "mantravalcons",
        bech32PrefixConsPub: "mantravalconspub",
    },
    daemon_name: "mantrad",
    slip44: 118,
    fees: {
        fee_tokens: [
            {
                denom: "UOM",
                low_gas_price: 0.01,
                average_gas_price: 0.025,
                high_gas_price: 0.03,
            },
        ],
    },
    staking: {
        staking_tokens: [
            {
                denom: "uom",
            },
        ],
    },
    apis: {
        rpc: [
            {
                address: "https://rpc.hongbai.mantrachain.io",
            },
        ],
        rest: [
            {
                address: "https://api.hongbai.mantrachain.io",
            },
        ],
    },
};

// export const manAssetList: AssetList = {
//     chain_name: "mantrachaintestnet",
//     assets: [
//         {
//             base: "uOM",
//             display: "UOM",
//             name: "mantra",
//             description: "Hongbai testnet",
//             denom_units: [
//                 {
//                     denom: "uom",
//                     exponent: 6,
//                 },
//             ],
//             symbol: "OM",
//             logo_URIs: {
//                 png: "gc.png",
//             },
//         },
//     ],
// };


