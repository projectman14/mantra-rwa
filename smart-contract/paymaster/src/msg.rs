use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Timestamp, Uint128, Uint64};
use crate::state::PayMaster;

#[cw_serde]
pub struct InstantiateMsg {
    pub admin : Addr,
}

#[cw_serde]
pub enum ExecuteMsg {
    AddPayment{ receiver : Addr, token_address : Addr, token_symbol : String, decimals : u32, amount : Uint64, start_date : Timestamp, frequency_in_days : u64},
    RemovePayment{ payment_id : Uint128},
    UpdatePaymentStatus { },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(AllPayments)]
    GetPayments { },
    #[returns(PayMaster)]
    GetPaymentByID { id : Uint128},
}

#[cw_serde]
pub struct AllPayments{
    pub payments : Vec<PayMaster>,
}