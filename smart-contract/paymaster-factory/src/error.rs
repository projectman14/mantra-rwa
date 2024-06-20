use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Custom Error val: {val:?}")]
    CustomError { val: String },

    #[error("Paymaster already exists")]
    PaymasterExists {},

    #[error("No Field {field} in Reply")]
    NoFieldInReply{ field : String },
}
