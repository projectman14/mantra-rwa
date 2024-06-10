#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_json_binary, WasmQuery, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Addr, Uint64, ReplyOn, WasmMsg, SubMsg, Reply};

use cw2::set_contract_version;
use cw_utils::parse_reply_instantiate_data;
use execute::{add_token_address, change_loan_contract_status, mint_loan_contract};
use cosmwasm_schema::cw_serde;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, LoanInfos, PriceResponse};
use crate::state::{LoanContract, CONTRACTS, MINTER, ADMINS, TOKEN};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:loan_database";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    
    ADMINS.save(deps.storage, &msg.admins)?;

    MINTER.save(deps.storage, &msg.minter)?;

    Ok(Response::new().add_attribute("action", "Instantiate").add_attribute("Minter", msg.minter.to_string()))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg{
        ExecuteMsg::MintLoanContract { borrower, token_uri, borrowed_amount, interest, days_before_expiration } => mint_loan_contract(deps, env, borrower, token_uri, borrowed_amount, interest, days_before_expiration),
        ExecuteMsg::ChangeLoanContractStatus { borrower, status_code, paid_amount } => change_loan_contract_status(deps, info, borrower, paid_amount, status_code),
        ExecuteMsg::AddTokenAddress { address } => add_token_address(deps, address),
    }
}

pub mod execute {
    use cosmwasm_std::{QueryRequest, Uint128};

    use super::*;

    #[cw_serde]
    pub struct LoanInstantiate{
        pub database_address: Addr,
        pub borrower : Addr,
        pub token_uri : String,
        pub borrowed_amount : Uint64,
        pub interest : Uint64,
        pub days_before_expiration : u64,
    }

    #[cw_serde]
    pub struct TokenMsg {
        pub mint : Mint,
    }

    #[cw_serde]
    pub struct Mint { 
        pub recipient: String, 
        pub amount: Uint128 
    }

    #[cw_serde]
    pub struct QueryPrice {
        pub get_price: GetPrice,
    }

    #[cw_serde]
    pub struct GetPrice {
        pub symbol: String,
    }

    pub fn mint_loan_contract(deps: DepsMut, env : Env, borrower : Addr, token_uri : String, borrowed_amount : Uint64, interest : Uint64, days_before_expiration : u64) -> Result<Response, ContractError>{
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
                    days_before_expiration,
                };

                let stock_price_request = QueryRequest::Wasm(
                    WasmQuery::Smart {
                        contract_addr : "mantra1q44nqkfcude7je0tqhu0u8mm7x8uhgj73n94k2vkx87tsr6yaujsdu3s4a".to_string(),
                        msg : to_json_binary(&QueryPrice{
                            get_price : GetPrice { symbol : "USDC".to_string() },
                        })?,
                    }
                ) ;

                let stock_price : PriceResponse = deps.querier.query(&stock_price_request)?;

                let base: u64 = 10;

                let token_amount = Uint128::new((borrowed_amount.u64() * base.pow(stock_price.expo as u32) / stock_price.price as u64) as u128 + 1);

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
                };

                let token_address = TOKEN.load(deps.storage).map_err(|_| ContractError::TokenAddressNotFound {  })?;

                let token_msg = SubMsg::new(
                    WasmMsg::Execute { 
                        contract_addr: token_address.to_string(), 
                        msg: to_json_binary(&TokenMsg{
                            mint : Mint {
                                recipient : borrower.to_owned().to_string(), 
                                amount : token_amount,
                            }
                        })?, 
                        funds: vec![] 
                    });

                Ok(Response::new().add_submessage(mint_msg).add_submessage(token_msg))
            }
        }
    }

    #[cw_serde]
    pub struct BurnMsg{
        pub burn : Burn,
    }

    #[cw_serde]
    pub struct Burn{
        pub amount : Uint128,
    }

    pub fn change_loan_contract_status(deps: DepsMut, info : MessageInfo, borrower : Addr, paid_amount : Uint64, status_code : Uint64) -> Result<Response, ContractError>{
        let mut loan_info = CONTRACTS.load(deps.storage, borrower.clone())?;

        let index = loan_info.iter().position(|x| (*x).address == info.sender);

        match index {
            None => Err(ContractError::InvalidAddr {  }),
            Some(index) => {
                let mut loan_contract = loan_info[index].clone();

                loan_contract.status_code = status_code;

                loan_info[index] = loan_contract;

                CONTRACTS.save(deps.storage, borrower.clone(), &loan_info)?;

                if status_code == Uint64::new(1) {
                    let stock_price_request = QueryRequest::Wasm(
                        WasmQuery::Smart {
                            contract_addr : "mantra1q44nqkfcude7je0tqhu0u8mm7x8uhgj73n94k2vkx87tsr6yaujsdu3s4a".to_string(),
                            msg : to_json_binary(&QueryPrice{
                                get_price : GetPrice { symbol : "USDC".to_string() },
                            })?,
                        }
                    ) ;

                    let stock_price : PriceResponse = deps.querier.query(&stock_price_request)?;

                    let base: u64 = 10;

                    let token_amount = Uint128::new((paid_amount.u64() * base.pow(stock_price.expo as u32) / stock_price.price as u64) as u128 + 1);

                    let token_address = TOKEN.load(deps.storage).map_err(|_| ContractError::TokenAddressNotFound {  })?;

                    let burn_msg : SubMsg = SubMsg::new(
                        WasmMsg::Execute { 
                            contract_addr: token_address.to_string(), 
                            msg: to_json_binary(&BurnMsg{
                                burn : Burn {
                                    amount : token_amount,
                                }
                            })?, 
                            funds: vec![] 
                        });

                    Ok(Response::new()
                    .add_attribute("action", "Change loan contract status")
                    .add_attribute("borrower", borrower.clone())
                    .add_attribute("status_code", status_code)
                    .add_submessage(burn_msg))
                }
                else if status_code == Uint64::new(2) {
                    Ok(Response::new()
                    .add_attribute("action", "Change loan contract status")
                    .add_attribute("borrower", borrower.clone())
                    .add_attribute("status_code", status_code))
                }
                else{
                    Err(ContractError::UnknownStatusCode { code: status_code })
                }
            }
        }
    }

    pub fn add_token_address(deps: DepsMut, token : Addr) -> Result<Response, ContractError> {
        let validated_addr = deps.api.addr_validate(token.as_str())?;

        TOKEN.save(deps.storage, &validated_addr)?;

        Ok(Response::new()
            .add_attribute("action", "Added token address")
            .add_attribute("value", validated_addr))
    }
}


#[cfg_attr(not(feature = "library"), entry_point)]
pub fn reply(deps: DepsMut, _env: Env, msg: Reply) -> Result<Response, ContractError> {
    let reply = parse_reply_instantiate_data(msg.to_owned()).unwrap();

    let contract_address = Addr::unchecked(reply.contract_address);

    let events = msg.result.into_result().unwrap().events;
    
    let wasm_event = events.iter().find(|x| x.ty == "wasm".to_string());

    match wasm_event {
        None => Err(ContractError::NoFieldInReply { field: "wasm".to_string() }),
        Some(wasm_event) => {
            let borrower_attri = wasm_event.attributes.iter().find(|x| x.key == "borrower".to_string());

            match borrower_attri {
                None => Err(ContractError::NoFieldInReply { field: "borrower".to_string() }),
                Some(borrower_attri) => {
                    let borrower = Addr::unchecked(borrower_attri.value.to_owned());

                    let loan_contract = LoanContract{
                        address : contract_address.to_owned(),
                        status_code : Uint64::new(0),
                    };

                    let contract_info = CONTRACTS.may_load(deps.storage, borrower.to_owned())?;

                    match contract_info {
                        None => {
                            let loan_vec = vec![loan_contract];

                            CONTRACTS.save(deps.storage, borrower.to_owned(), &loan_vec)?;
                        },
                        Some(mut contract_info) => {
                            contract_info.push(loan_contract);

                            CONTRACTS.save(deps.storage, borrower.to_owned(), &contract_info)?;
                        }
                    }

                    Ok(Response::new()
                        .add_attribute("action", "Add minted contract address")
                        .add_attribute("borrower", borrower)
                        .add_attribute("contract_address", contract_address))
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
