use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Uint64};

use crate::state::{ContractInfo, DateTime};

#[cw_serde]
pub struct InstantiateMsg {
    pub database_address: Addr,
    pub borrower : Addr,
    pub token_uri : String,
    pub borrowed_amount : Uint64,
    pub interest : Uint64,
    pub expiration_date : DateTime,
}

#[cw_serde]
pub enum ExecuteMsg {
    AcceptPayment { payment : Uint64},
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(ContractInfo)]
    GetDetails {},
}