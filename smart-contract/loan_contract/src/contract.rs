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
        status_code : Uint64::new(0),
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
    }

    pub fn accept_payment(deps : DepsMut, env : Env, payment : Uint64) -> Result<Response, ContractError> {
        let mut contract_info = CONTRACT_INFO.load(deps.storage)?;
        let remaining_payment = query::remaining_payment(deps.as_ref(), env.to_owned())?;

        if env.block.time < contract_info.expiration_date && contract_info.status_code == Uint64::new(0) {
            if payment > remaining_payment {
                return Err(ContractError::OverPay {  });
            }
            else if payment == remaining_payment {
                contract_info.currently_paid += payment;
                CONTRACT_INFO.save(deps.storage, &contract_info)?;

                let status_execute_msg = StatusExecuteMsg{
                    change_loan_contract_status : ChangeLoanContractStatus {
                    borrower : contract_info.borrower,
                    status_code : Uint64::new(1),
                    }
                };

                let sub_msg = SubMsg::new(WasmMsg::Execute { contract_addr: DATABASE_ADDRESS.load(deps.storage).unwrap().into_string(), 
                    msg: to_json_binary(&status_execute_msg)?, 
                    funds: vec![],
                });

                change_status(deps, Uint64::new(1))?;

                return Ok(Response::new().add_submessage(sub_msg).add_attribute("action", "Add payment").add_attribute("amount", payment).add_attribute("status_code", "1"));
            }
            else {
                contract_info.currently_paid += payment;
                CONTRACT_INFO.save(deps.storage, &contract_info)?;

                return Ok(Response::new().add_attribute("action", "Add payment").add_attribute("amount", payment));
            }
        }
        else if contract_info.status_code == Uint64::new(1){
            Err(ContractError::PaidBack {  })
        }
        else{
            update_status(deps, env)?;
            Err(ContractError::ExpirationDateCrossed {  })
        }
    }

    pub fn update_status(deps : DepsMut, env : Env) -> Result<Response, ContractError> {
        let contract_info = CONTRACT_INFO.load(deps.storage)?;

        if contract_info.status_code == Uint64::new(0) {

            if env.block.time >= contract_info.expiration_date {
                let status_execute_msg = StatusExecuteMsg{
                    change_loan_contract_status : ChangeLoanContractStatus {
                    borrower : contract_info.borrower,
                    status_code : Uint64::new(2),
                    }
                };

                let sub_msg = SubMsg::new(WasmMsg::Execute { contract_addr: DATABASE_ADDRESS.load(deps.storage).unwrap().into_string(), 
                    msg: to_json_binary(&status_execute_msg)?, 
                    funds: vec![] 
                });

                change_status(deps, Uint64::new(2))?;

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
        else{
            Ok(Response::new()
            .add_attribute("action", "Update status")
            .add_attribute("status", contract_info.status_code))
        }
    }

    fn change_status(deps : DepsMut, status : Uint64) -> Result<(), ContractError>{
        let mut contract_info = CONTRACT_INFO.load(deps.storage)?;

        contract_info.status_code = status;

        CONTRACT_INFO.save(deps.storage, &contract_info)?;

        Ok(())
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg{
        QueryMsg::GetDetails {  } => to_json_binary(&query::get_details(deps)?),
        QueryMsg::RemainingPayment {  } => to_json_binary(&query::remaining_payment(deps, env)?),
    }
}

pub mod query{
    use super::*;

    pub fn get_details(deps : Deps) -> StdResult<ContractInfo>{
        Ok(CONTRACT_INFO.load(deps.storage)?)
    }

    pub fn remaining_payment(deps : Deps, env : Env) -> StdResult<Uint64>{
        let contract_info = CONTRACT_INFO.load(deps.storage)?;

        let diff_year = Uint64::new((contract_info.expiration_date.seconds() - env.block.time.seconds()) / 31536000);

        let max_pay = contract_info.borrowed_amount + ((contract_info.borrowed_amount * contract_info.interest * diff_year) / Uint64::new(100)) - contract_info.currently_paid;

        Ok(max_pay)
    }
}

#[cfg(test)]
mod tests {}
