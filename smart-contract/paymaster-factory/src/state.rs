use cosmwasm_std::Addr;
use cw_storage_plus::{Map, Item};

pub const CONTRACTS: Map<Addr, Addr> = Map::new("contracts"); //Map<Addr : owner, Addr : contract address>
pub const CODE_ID : Item<u64> = Item::new("code_id");