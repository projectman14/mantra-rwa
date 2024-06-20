use cosmwasm_schema::cw_serde;
use cosmwasm_std::Addr;

#[cw_serde]
pub struct InstantiateMsg {
    pub code_id : u64,
}

#[cw_serde]
pub enum ExecuteMsg {
    MintPaymasterAccount { address : Addr },
}

#[cw_serde]
pub enum QueryMsg {
    GetPaymasterAddress { address : Addr },
}
