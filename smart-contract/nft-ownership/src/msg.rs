use cosmwasm_schema::{cw_serde, QueryResponses};

use cosmwasm_std::Addr;

#[cw_serde]
pub struct InstantiateMsg {
}

#[cw_serde]
pub enum ExecuteMsg {
    AddAsset{ owner : Addr, token_id : String },
    RemoveAsset{ owner : Addr, token_id : String },
    TransferAsset{ sender : Addr, receiver : Addr, token_id : String},
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(bool)]
    IsOwned{ owner : Addr, token_id : String },
    #[returns(OwnedAssetsResponse)]
    OwnedAssets{ owner : Addr},
}

#[cw_serde]
pub struct OwnedAssetsResponse {
    pub assets : Vec<String>,
}
