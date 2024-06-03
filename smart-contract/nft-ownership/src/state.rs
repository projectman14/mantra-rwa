use cosmwasm_std::{Addr, Uint64};
use cw_storage_plus::{Map, Item};

use cosmwasm_schema::cw_serde;

#[cw_serde]
pub struct LoanContract{
    pub address : Addr,
    pub status_code : Uint64,
}

#[cw_serde]
pub struct Admin{
    pub address : Addr,
}

pub const CONTRACTS : Map<Addr, Vec<LoanContract>> = Map::new("contracts");
pub const ADMINS : Item<Vec<Admin>> = Item::new("admins");
pub const MINTER : Item<u64> = Item::new("minter");  //Code ID of uninstantitated loan contract