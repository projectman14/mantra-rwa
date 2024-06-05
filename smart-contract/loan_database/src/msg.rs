use cosmwasm_schema::{cw_serde, QueryResponses};

use cosmwasm_std::{Addr, Uint64};
use crate::state::LoanContract;

#[cw_serde]
pub struct InstantiateMsg {
    pub admins : Vec<Addr>,
    pub minter : Addr,
}

#[cw_serde]
pub enum ExecuteMsg {
    MintLoanContract{ borrower : Addr, token_uri : String, borrowed_amount : Uint64, interest : Uint64, expiration_date : DateTime},
    ChangeLoanContractStatus{ borrower : Addr, status_code : Uint64 },
}

#[cw_serde]
pub struct DateTime{
    date : Uint64,
    month : Uint64,
    year : Uint64,
    hour : Uint64,
    minute : Uint64,
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(LoanInfos)]
    GetLoans{ borrower : Addr },
}

#[cw_serde]
pub struct LoanInfos {
    pub contracts : Vec<LoanContract>,
}
