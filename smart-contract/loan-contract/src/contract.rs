#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint64, Addr, WasmMsg, SubMsg};
use cw2::set_contract_version;
use cosmwasm_schema::cw_serde;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};

use crate::state::{ContractInfo, DateTime, CONTRACT_INFO, CW20_ADDRESS, DATABASE_ADDRESS};

use chrono::{Datelike, Local, Timelike};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:loan-contract";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");


#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    let current_time = Local::now();

    let start_time = DateTime{
        date : Uint64::new(current_time.day().into()),
        month : Uint64::new(current_time.month().into()),
        year : Uint64::new(current_time.year().try_into().unwrap()),
        hour : Uint64::new(current_time.hour().into()),
        minute : Uint64::new(current_time.minute().into()),
    };

    let contract_info = ContractInfo{
        borrower : msg.borrower,
        token_uri : msg.token_uri,
        borrowed_amount : msg.borrowed_amount,
        interest : msg.interest,
        start_date : start_time,
        expiration_date : msg.expiration_date,
        currently_paid : Uint64::new(0),
    };

    CONTRACT_INFO.save(deps.storage, &contract_info)?;

    let cw20_address = Addr::unchecked("address here");
    CW20_ADDRESS.save(deps.storage, &cw20_address)?;

    let database_address = deps.api.addr_validate(msg.database_address.as_str())?;
    DATABASE_ADDRESS.save(deps.storage, &database_address)?;

    Ok(Response::new()
        .add_attribute("action", "instantiate"))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg{
        ExecuteMsg::AcceptPayment { payment } => execute::accept_payment(deps, payment),
    }
}

pub mod execute{
    use super::*;

    #[cw_serde]
    pub struct StatusExecuteMsg{
        pub borrower : Addr,
        pub status_code : Uint64,
    }

    pub fn accept_payment(deps : DepsMut, payment : Uint64) -> Result<Response, ContractError> {
        let mut contract_info = CONTRACT_INFO.load(deps.storage)?;

        let diff_year = contract_info.start_date.diff_in_days(&contract_info.expiration_date);

        let max_pay = ((contract_info.borrowed_amount * contract_info.interest * diff_year) / Uint64::new(100)) - contract_info.currently_paid;

        if payment > max_pay {
            return Err(ContractError::OverPay {  });
        }
        else if payment == max_pay {
            contract_info.currently_paid += payment;
            CONTRACT_INFO.save(deps.storage, &contract_info)?;

            let status_execute_msg = StatusExecuteMsg{
                borrower : contract_info.borrower,
                status_code : Uint64::new(1),
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
