#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Addr, Uint64, ReplyOn, WasmMsg, SubMsg, Reply};
use cw_utils::parse_instantiate_response_data;

use cw2::set_contract_version;
use execute::{change_loan_contract_status, mint_loan_contract};
use cosmwasm_schema::cw_serde;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, LoanInfos, DateTime};
use crate::state::{LoanContract, ADMINS, CONTRACTS, MINTER};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:loan_database";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    unimplemented!()
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg{
        ExecuteMsg::MintLoanContract { borrower, token_uri, borrowed_amount, interest, expiration_date } => mint_loan_contract(deps, borrower, token_uri, borrowed_amount, interest, expiration_date),
        ExecuteMsg::ChangeLoanContractStatus { borrower, status_code } => change_loan_contract_status(deps, info, borrower, status_code),
    }
}

pub mod execute {
    use super::*;

    #[cw_serde]
    pub struct LoanInstantiate{
        pub database_address: Addr,
        pub borrower : Addr,
        pub token_uri : String,
        pub borrowed_amount : Uint64,
        pub interest : Uint64,
        pub expiration_date : DateTime,
    }

    pub fn mint_loan_contract(deps: DepsMut, env : Env, borrower : Addr, token_uri : String, borrowed_amount : Uint64, interest : Uint64, expiration_date : DateTime) -> Result<Respone, ContractError>{
        let minter_code_id = MINTER.may_load(deps.storage)?;

        match minter_code_id{
            None => Err(ContractError::MinterValueNotFound {  }),
            Some(minter_code_id) =>{
                let instantiate_msg = LoanInstantiate{
                    database_address : env.contract.address,
                    borrower,
                    token_uri,
                    borrowed_amount,
                    interest,
                    expiration_date,
                };

                let mint_msg = SubMsg{ 
                    msg : WasmMsg::Instantiate { 
                    admin: None, 
                    code_id: MINTER.load(deps.storage)?, 
                    msg: to_json_binary(&instantiate_msg)?, 
                    funds: vec![], 
                    label: format!("Loan contract for borrower {borrower} with collateral {token_uri}").to_string() 
                }.into(),
                id : 1,
                gas_limit : None,
                reply_on : ReplyOn::Success,
                payload : None,
            };

                Ok(Response::new().add_submessage(mint_msg))
            }
        }
    }

    pub fn change_loan_contract_status(deps: DepsMut, info : MessageInfo, borrower : Addr, status_code : Uint64) -> Result<Response, ContractError>{
        let mut loan_info = CONTRACTS.load(deps.storage, borrower.clone())?;

        let index = loan_info.iter().position(|x| (*x).address == info.sender);

        match index {
            None => Err(ContractError::InvalidAddr {  }),
            Some(index) => {
                let mut loan_contract = &loan_info[index];

                loan_contract.status_code = status_code;

                loan_info[index] = *loan_contract;

                CONTRACTS.save(deps.storage, borrower.clone(), &loan_info);

                Ok(Response::new()
                .add_attribute("action", "Change loan contract status")
                .add_attribute("borrower", borrower.clone())
                .add_attribute("status_code", status_code))
            }
        }
    }
}


#[cfg_attr(not(feature = "library"), entry_point)]
pub fn reply(deps: DepsMut, env: Env, msg: Reply) -> Result<Response, ContractError> {
    let reply = parse_instantiate_response_data(&msg.result.into_result().unwrap().msg_responses[0].value);
}




#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps,
    _env: Env,
    msg: QueryMsg
) -> StdResult<Binary> {
    match msg{
        QueryMsg::GetLoans { borrower } => to_json_binary(&query::get_loans(deps, borrower)?),
    }
}

pub mod query {
    use super::*;

    pub fn get_loans( deps : Deps, borrower : Addr) -> StdResult<LoanInfos>{
        let loan_info = CONTRACTS.load(deps.storage, borrower.clone())?;
   
        let loan_contracts = LoanInfos{
            contracts : loan_info,
        };

        Ok(loan_contracts)
    }
}

#[cfg(test)]
mod tests {
}
