#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Addr, Uint64, ReplyOn, WasmMsg, SubMsg, Reply};

use cw2::set_contract_version;
use execute::{change_loan_contract_status, mint_loan_contract};
use cosmwasm_schema::cw_serde;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, LoanInfos, DateTime};
use crate::state::{LoanContract, CONTRACTS, MINTER};

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
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg{
        ExecuteMsg::MintLoanContract { borrower, token_uri, borrowed_amount, interest, expiration_date } => mint_loan_contract(deps, env, borrower, token_uri, borrowed_amount, interest, expiration_date),
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

    pub fn mint_loan_contract(deps: DepsMut, env : Env, borrower : Addr, token_uri : String, borrowed_amount : Uint64, interest : Uint64, expiration_date : DateTime) -> Result<Response, ContractError>{
        let minter_code_id = MINTER.may_load(deps.storage)?;

        match minter_code_id{
            None => Err(ContractError::MinterValueNotFound {  }),
            Some(minter_code_id) =>{
                let instantiate_msg = LoanInstantiate{
                    database_address : env.contract.address,
                    borrower : borrower.clone(),
                    token_uri : token_uri.clone(),
                    borrowed_amount,
                    interest,
                    expiration_date,
                };

                let mint_msg = SubMsg{ 
                    msg : WasmMsg::Instantiate { 
                    admin: None, 
                    code_id: minter_code_id, 
                    msg: to_json_binary(&instantiate_msg)?, 
                    funds: vec![], 
                    label: format!("Loan contract for borrower {borrower} with collateral {token_uri}").to_string() 
                }.into(),
                id : 1,
                gas_limit : None,
                reply_on : ReplyOn::Success,
                payload : Binary::new(vec![]),
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
                let mut loan_contract = loan_info[index].clone();

                loan_contract.status_code = status_code;

                loan_info[index] = loan_contract;

                CONTRACTS.save(deps.storage, borrower.clone(), &loan_info)?;

                Ok(Response::new()
                .add_attribute("action", "Change loan contract status")
                .add_attribute("borrower", borrower.clone())
                .add_attribute("status_code", status_code))
            }
        }
    }
}


#[cfg_attr(not(feature = "library"), entry_point)]
pub fn reply(deps: DepsMut, _env: Env, msg: Reply) -> Result<Response, ContractError> {
    let message_response = msg.result.into_result().unwrap().msg_responses;
    let contract_address_pos = message_response.iter().position(|x| x.type_url == "contract_address".to_string());
    let borrower_pos = message_response.iter().position(|x| x.type_url == "borrower".to_string());

    match contract_address_pos{
        None => Err(ContractError::NoFieldInReply { field: "contract_address".to_string() }),
        Some(contract_address_pos)=>{
            
            match borrower_pos{
                None => Err(ContractError::NoFieldInReply{ field : "borrower".to_string()}),
                Some(borrower_pos) => {
                    let contract_address = Addr::unchecked(String::from_utf8_lossy(message_response[contract_address_pos].value.as_slice()));
                    let borrower = Addr::unchecked(String::from_utf8_lossy(message_response[borrower_pos].value.as_slice()));

                    let mut loan_info = CONTRACTS.load(deps.storage, borrower.clone())?;
                    let loan_contract = LoanContract{
                        address : contract_address.clone(),
                        status_code : Uint64::new(0),
                    };

                    loan_info.push(loan_contract);

                    CONTRACTS.save(deps.storage, borrower.clone(), &loan_info)?;

                    Ok(Response::new()
                        .add_attribute("action", "add contract address")
                        .add_attribute("borrower", borrower.clone())
                        .add_attribute("contract_address", contract_address.clone()))
                }
            }
            
        }
    }
    
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
