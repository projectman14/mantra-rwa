#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, Reply, StdResult, Addr, SubMsg, WasmMsg, ReplyOn};
use cw2::set_contract_version;
use cosmwasm_schema::cw_serde;
use cw_utils::parse_reply_instantiate_data;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{CONTRACTS, CODE_ID};

const CONTRACT_NAME: &str = "crates.io:paymaster-factory";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");
 

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    Ok(Response::new().add_attribute("action", "Mint paymaster factory contract"))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg{
        ExecuteMsg::MintPaymasterAccount {  } => execute::mint_paymaster_account(deps, info),
    }
}

pub mod execute{
    use super::*;

    #[cw_serde]
    pub struct MintMsg{
        pub admin : Addr,
    }

    pub fn mint_paymaster_account(deps : DepsMut, info : MessageInfo) -> Result<Response, ContractError>{
        let paymaster_address = CONTRACTS.may_load(deps.storage, info.sender.to_owned())?;

        match paymaster_address{
            None => {
                let contract_mint = MintMsg{
                    admin : info.sender.to_owned(),
                };

                let admin = info.sender.to_owned();

                let mint_msg = SubMsg{
                    id : 1,
                    msg : WasmMsg::Instantiate { 
                        admin: None, 
                        code_id: CODE_ID.load(deps.storage)?, 
                        msg: to_json_binary(&contract_mint)?, 
                        funds: vec![], 
                        label: format!("Minted paymaster for {admin}").to_string() }
                        .into(),
                    gas_limit : None,
                    reply_on : ReplyOn::Success,
                };

                Ok(Response::new().add_submessage(mint_msg).add_attribute("action", "Mint paymaster account").add_attribute("admin", admin))
            },
            Some(_) => Err(ContractError::PaymasterExists {  })
        }
        
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
            let admin_attri = wasm_event.attributes.iter().find(|x| x.key == "admin".to_string());

            match admin_attri {
                None => Err(ContractError::NoFieldInReply { field: "admin".to_string() }),
                Some(admin_attri) => {
                    let admin = Addr::unchecked(admin_attri.value.to_owned());

                    let contract_info = CONTRACTS.may_load(deps.storage, admin.to_owned())?;

                    match contract_info {
                        None => {
                            CONTRACTS.save(deps.storage, admin.to_owned(), &contract_address)?;
                        },
                        Some(_) => {
                            CONTRACTS.save(deps.storage, admin.to_owned(), &contract_address)?;
                        }
                    }

                    Ok(Response::new()
                        .add_attribute("action", "Add minted contract address")
                        .add_attribute("admin", admin)
                        .add_attribute("contract_address", contract_address))
                }
            }
        }
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg{
        QueryMsg::GetPaymasterAddress { address } => to_json_binary(&query::get_paymaster_address(deps, address)?),
    }
}

pub mod query{
    use super::*;

    pub fn get_paymaster_address(deps : Deps, address : Addr) -> StdResult<Addr>{
        let paymaster = CONTRACTS.may_load(deps.storage, address)?;

        match paymaster{
            None => Err(cosmwasm_std::StdError::NotFound { kind: "address".to_string() }),
            Some(paymaster) => Ok(paymaster)
        }
    }
}

#[cfg(test)]
mod tests {}
