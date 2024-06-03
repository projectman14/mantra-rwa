#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Addr, Uint64, WasmMsg};
use cw2::set_contract_version;
use execute::{change_loan_contract_status, mint_loan_contract};

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, LoanInfos, DateTime};
use crate::state::{CONTRACTS, ADMINS, MINTER};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:nft-ownership";
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
        ExecuteMsg::ChangeLoanContractStatus { borrower, token_uri, status_code } => change_loan_contract_status(deps, info, borrower, status_code),
    }
}

pub mod execute {
    use super::*;

    pub fn mint_loan_contract(deps: DepsMut, borrower : Addr, token_uri : String, borrowed_amount : Uint64, interest : Uint64, expiration_date : DateTime){
        let minter_code_id = MINTER.may_load(deps.storage)?;

        match minter_code_id{
            None => Err(ContractError::MinterValueNotFound {  }),
            Some(minter_code_id) =>{
                let mintMsg = WasmMsg::Instantiate { admin: None, code_id: minter_code_id, msg: (), funds: vec![], label: format!("Loan contract instantiate with borrower {borrower} and collateral {token_uri}").to_string() };
                unimplemented!()
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
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, from_json};

    
}
