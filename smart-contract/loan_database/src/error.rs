use cosmwasm_std::{StdError, Addr};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},
    
    #[error("Invalid Address")]
    InvalidAddr {},

    #[error("Address Validating Failed")]
    AddrValidationFailed {},

    #[error("Account does not exist")]
    AccountDoesNotExist { address : Addr},

    #[error("Asset Not Found")]
    AssetNotFound { token_id : String},

    #[error("Minter value not found")]
    MinterValueNotFound{},

    #[error("SubMsgFailure")]
    SubMsgFailure{},

    #[error("No Contract Address in Reply")]
    NoContractAddressInReply{},

    #[error("No Field {field} in Reply")]
    NoFieldInReply{ field : String },
}
