#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Addr};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, OwnedAssetsResponse, InstantiateMsg, QueryMsg};
use crate::state::{Account, ACCOUNTS};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:nft-ownership";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::AddAsset { owner, token_id } => execute::add_asset(deps, owner, token_id),
        ExecuteMsg::RemoveAsset { owner , token_id } => execute::remove_asset(deps, owner, token_id),
        ExecuteMsg::TransferAsset { sender, receiver, token_id } => execute::transfer_asset(deps, sender, receiver, token_id),
    }
}

pub mod execute {
    use cosmwasm_std::Uint128;

    use super::*;

    pub fn add_asset(deps: DepsMut, owner : Addr, token_id : String ) -> Result<Response, ContractError>{
        let checked = ACCOUNTS.may_load(deps.storage, owner.clone())?;
        match checked {
            None => Err(ContractError::AccountDoesNotExist { address : owner.clone() }),
            Some(mut checked) => {
                checked.assets.push(token_id.clone());
                checked.number_of_assets_owned += Uint128::new(1);

                ACCOUNTS.save(deps.storage, owner.clone(), &checked)?;

                Ok(Response::new()
                .add_attribute("action", "Add Asset")
                .add_attribute("owner", owner.clone())
                .add_attribute("token_id", token_id.clone()))
            },
        }
    }

    pub fn remove_asset(deps : DepsMut, owner : Addr, token_id : String) -> Result<Response, ContractError>{
        let checked = ACCOUNTS.may_load(deps.storage, owner.clone())?;
        match checked {
            None => Err(ContractError::AccountDoesNotExist { address : owner.clone() }),
            Some(mut checked) => {
                let index = checked.assets.iter().position(|x| *x == token_id.as_str());
                
                match index{
                    None => Err(ContractError::AssetNotFound { token_id : token_id.clone() }),
                    Some(index) => {
                        checked.assets.remove(index);
                        checked.number_of_assets_owned -= Uint128::new(1);

                        ACCOUNTS.save(deps.storage, owner.clone(), &checked)?;

                        Ok(Response::new()
                        .add_attribute("action", "Remove Asset")
                        .add_attribute("owner", owner.clone())
                        .add_attribute("token_id", token_id.clone()))
                    },
                }
            },
        }
    }

    pub fn transfer_asset(deps: DepsMut, sender : Addr, receiver : Addr, token_id : String) -> Result<Response, ContractError>{
        let sender_info = ACCOUNTS.may_load(deps.storage, sender.clone())?;

        match sender_info {
            None => Err(ContractError::AccountDoesNotExist { address: sender.clone() }),
            Some(mut sender_info) => {
                let receiver_info = ACCOUNTS.may_load(deps.storage, receiver.clone())?;

                match receiver_info {
                    None => Err(ContractError::AccountDoesNotExist { address: receiver.clone() }),
                    Some(mut receiver_info) => {
                        let index = sender_info.assets.iter().position(|x| *x == token_id.as_str());

                        match index{
                            None => Err(ContractError::AssetNotFound { token_id : token_id.clone() }),
                            Some(index) => {
                                sender_info.assets.remove(index);
                                sender_info.number_of_assets_owned -= Uint128::new(1);

                                receiver_info.assets.push(token_id.clone());
                                receiver_info.number_of_assets_owned += Uint128::new(1);

                                ACCOUNTS.save(deps.storage, sender.clone(), &sender_info)?;
                                ACCOUNTS.save(deps.storage, receiver.clone(), &receiver_info)?;

                                Ok(Response::new()
                                .add_attribute("action", "Transfer Asset")
                                .add_attribute("sender", sender.clone())
                                .add_attribute("receiver", receiver.clone())
                                .add_attribute("token_id", token_id.clone()))
                            },
                        }
                    },
                }
            },
        }
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    unimplemented!()
}

pub mod query {
    use super::*;
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, from_json};

    
}
