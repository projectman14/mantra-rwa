#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint64, Addr, WasmMsg, SubMsg};
use cw2::set_contract_version;
use cosmwasm_schema::cw_serde;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};

use crate::state::{ContractInfo, CONTRACT_INFO, DATABASE_ADDRESS};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:loan-contract";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");


#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    let contract_info = ContractInfo{
        borrower : msg.borrower.to_owned(),
        token_uri : msg.token_uri.to_owned(),
        borrowed_amount : msg.borrowed_amount,
        interest : msg.interest,
        start_date : env.block.time,
        expiration_date : env.block.time.plus_days(msg.days_before_expiration),
        currently_paid : Uint64::new(0),
    };

    CONTRACT_INFO.save(deps.storage, &contract_info)?;

    let database_address = deps.api.addr_validate(msg.database_address.as_str())?;
    DATABASE_ADDRESS.save(deps.storage, &database_address)?;

    Ok(Response::new()
        .add_attribute("action", "instantiate")
        .add_attribute("borrower", msg.borrower.to_string())
        .add_attribute("token_uri", msg.token_uri.to_string())
        .add_attribute("borrowed_amount", msg.borrowed_amount)
        .add_attribute("interest", msg.interest)
        .add_attribute("start_date", env.block.time.to_string())
        .add_attribute("expiration_date", env.block.time.plus_days(msg.days_before_expiration).to_string()))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg{
        ExecuteMsg::AcceptPayment { payment } => execute::accept_payment(deps, env, payment),
        ExecuteMsg::UpdateStatus {  } => execute::update_status(deps, env),
    }
}

pub mod execute{
    use super::*;

    #[cw_serde]
    pub struct StatusExecuteMsg{
        change_loan_contract_status : ChangeLoanContractStatus,
    }

    #[cw_serde]
    pub struct ChangeLoanContractStatus{
        pub borrower : Addr,
        pub status_code : Uint64,
        pub paid_amount : Uint64,
    }

    pub fn accept_payment(deps : DepsMut, env : Env, payment : Uint64) -> Result<Response, ContractError> {
        let mut contract_info = CONTRACT_INFO.load(deps.storage)?;

        if env.block.time < contract_info.expiration_date && contract_info.currently_paid != contract_info.borrowed_amount {
            let diff_year = Uint64::new(contract_info.expiration_date.seconds() - env.block.time.seconds() / 31536000);

            let max_pay = contract_info.borrowed_amount + ((contract_info.borrowed_amount * contract_info.interest * diff_year) / Uint64::new(100)) - contract_info.currently_paid;

            if payment > max_pay {
                return Err(ContractError::OverPay {  });
            }
            else if payment == max_pay {
                contract_info.currently_paid += payment;
                CONTRACT_INFO.save(deps.storage, &contract_info)?;

                let status_execute_msg = StatusExecuteMsg{
                    change_loan_contract_status : ChangeLoanContractStatus {
                    borrower : contract_info.borrower,
                    status_code : Uint64::new(1),
                    paid_amount : contract_info.currently_paid,
                    }
                };

                let sub_msg = SubMsg::new(WasmMsg::Execute { contract_addr: DATABASE_ADDRESS.load(deps.storage).unwrap().into_string(), 
                    msg: to_json_binary(&status_execute_msg)?, 
                    funds: vec![] 
                });

                return Ok(Response::new().add_submessage(sub_msg).add_attribute("action", "Add payment").add_attribute("amount", payment).add_attribute("status_code", "1"));
            }
            else {
                contract_info.currently_paid += payment;
                CONTRACT_INFO.save(deps.storage, &contract_info)?;

                return Ok(Response::new().add_attribute("action", "Add payment").add_attribute("amount", payment));
            }
        }
        else{
            Err(ContractError::ExpirationDateCrossed {  })
        }
    }

    pub fn update_status(deps : DepsMut, env : Env) -> Result<Response, ContractError> {
        let contract_info = CONTRACT_INFO.load(deps.storage)?;

        if env.block.time >= contract_info.expiration_date && contract_info.borrowed_amount > contract_info.currently_paid {
            let status_execute_msg = StatusExecuteMsg{
                change_loan_contract_status : ChangeLoanContractStatus {
                borrower : contract_info.borrower,
                status_code : Uint64::new(2),
                paid_amount : contract_info.currently_paid,
                }
            };

            let sub_msg = SubMsg::new(WasmMsg::Execute { contract_addr: DATABASE_ADDRESS.load(deps.storage).unwrap().into_string(), 
                msg: to_json_binary(&status_execute_msg)?, 
                funds: vec![] 
            });

            Ok(Response::new()
            .add_attribute("action", "Loan contract status update")
            .add_attribute("status_code", Uint64::new(2))
            .add_attribute("borrowed_amount", contract_info.borrowed_amount)
            .add_attribute("currently_paid", contract_info.currently_paid)
            .add_attribute("current_date", env.block.time.to_string())
            .add_attribute("expiration_date", contract_info.expiration_date.to_string())
            .add_submessage(sub_msg))
        }
        else{
            Ok(Response::new()
            .add_attribute("action", "Loan contract status update")
            .add_attribute("status_code", Uint64::new(0))
            .add_attribute("borrowed_amount", contract_info.borrowed_amount)
            .add_attribute("currently_paid", contract_info.currently_paid)
            .add_attribute("current_date", env.block.time.to_string())
            .add_attribute("expiration_date", contract_info.expiration_date.to_string()))
        }
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg{
        QueryMsg::GetDetails {  } => to_json_binary(&query::get_details(deps)?),
    }
}

pub mod query{
    use super::*;

    pub fn get_details(deps : Deps) -> StdResult<ContractInfo>{
        Ok(CONTRACT_INFO.load(deps.storage)?)
    }
}

#[cfg(test)]
mod tests {}
