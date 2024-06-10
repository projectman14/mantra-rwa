use cw_storage_plus::Item;
use cosmwasm_std::{Timestamp, Addr, Uint64};
use cosmwasm_schema::cw_serde;

#[cw_serde]
pub struct ContractInfo{
    pub borrower : Addr,
    pub token_uri : String,
    pub borrowed_amount : Uint64,
    pub interest : Uint64,
    pub start_date : Timestamp,
    pub expiration_date : Timestamp,
    pub currently_paid : Uint64,
    pub status_code : Uint64,
}

pub const CONTRACT_INFO : Item<ContractInfo> = Item::new("contract_info");
pub const DATABASE_ADDRESS : Item<Addr> = Item::new("database_id");