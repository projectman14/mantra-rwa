use cw_storage_plus::Item;
use cosmwasm_std::{Addr, Uint64};

use cosmwasm_schema::cw_serde;

#[cw_serde]
pub struct ContractInfo{
    pub borrower : Addr,
    pub token_uri : String,
    pub borrowed_amount : Uint64,
    pub interest : Uint64,
    pub start_date : DateTime,
    pub expiration_date : DateTime,
    pub currently_paid : Uint64,
}

#[cw_serde]
pub struct DateTime{
    pub date : Uint64,
    pub month : Uint64,
    pub year : Uint64,
    pub hour : Uint64,
    pub minute : Uint64,
}

impl DateTime {
    pub fn diff_in_days(&self, other : &Self) -> Uint64{
        let diff_min : Uint64 = (other.minute - self.minute) + (other.hour - self.hour) * Uint64::new(60) + (other.date - self.date) * Uint64::new(1440) + (other.month - self.month) * Uint64::new(43200) + (other.year - self.year) * Uint64::new(518400);

        let diff_days : Uint64 = diff_min / Uint64::new(1440);

        diff_days
    }
}

pub const CONTRACT_INFO : Item<ContractInfo> = Item::new("contract_info");
pub const CW20_ADDRESS  : Item<Addr> = Item::new("cw20_address");
pub const DATABASE_ADDRESS : Item<Addr> = Item::new("database_id");