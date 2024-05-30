use cosmwasm_std::{Addr, Uint128, Uint512, Uint64};
use cw_storage_plus::{Map, Item};

use cosmwasm_schema::cw_serde;

#[cw_serde]
pub struct Account {
    pub date_of_creation : DateAndTime,
    pub number_of_assets_owned : Uint128,
    pub number_of_auctions_won : Uint128,
    pub assets : Vec<String>,
    pub current_bids : Vec<AuctionBid>,
}

#[cw_serde]
pub struct DateAndTime{
    pub date: Uint64,
    pub month : Uint64,
    pub year : Uint64,
}

#[cw_serde]
pub struct AuctionBid {
    pub auction_address : Addr,
    pub current_bid : Uint512,
}

#[cw_serde]
pub struct Admin{
    pub address : Addr,
}

pub const ACCOUNTS : Map<Addr, Account> = Map::new("accounts");
pub const ADMINS : Item<Vec<Admin>> = Item::new("admins");