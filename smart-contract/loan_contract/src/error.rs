use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},
   
    #[error("Overpay")]
    OverPay{},

    #[error("Expiration date crossed")]
    ExpirationDateCrossed {},

    #[error("Loan already paid back")]
    PaidBack {},
}
