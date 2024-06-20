use cosmwasm_std::{Addr, Uint64, Uint128, Timestamp};
use cw_storage_plus::Item;

use cosmwasm_schema::cw_serde;

#[cw_serde]
pub struct PayMaster{
    pub payment_id : Uint128,
    pub receiver : Addr,
    pub token_symbol : String,
    pub token_address : Addr,
    pub decimals : u32,
    pub amount : Uint64,
    pub frequency_in_days : u64,
    pub next_payment_date : Timestamp,
}

pub const ADMIN : Item<Addr> = Item::new("admin");
pub const PAYMASTERS: Item<Vec<PayMaster>> = Item::new("paymasters");
pub const PAYMENTID : Item<Uint128> = Item::new("payment_id");