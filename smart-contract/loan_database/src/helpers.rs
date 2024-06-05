use cosmwasm_std::{to_json_binary, Addr, CosmosMsg, StdResult, WasmMsg, Deps, Reply};
use crate::error::ContractError;

use cosmwasm_schema::cw_serde;
use cw_utils::MsgInstantiateContractResponse;

use crate::msg::ExecuteMsg;

#[cw_serde]
pub struct CwTemplateContract(pub Addr);

impl CwTemplateContract {
    pub fn addr(&self) -> Addr {
        self.0.clone()
    }

    pub fn call<T: Into<ExecuteMsg>>(&self, msg: T) -> StdResult<CosmosMsg> {
        let msg = to_json_binary(&msg.into())?;
        Ok(WasmMsg::Execute {
            contract_addr: self.addr().into(),
            msg,
            funds: vec![],
        }
        .into())
    }
}

fn check_addr(deps : Deps , address : Addr) -> bool{
    match deps.api.addr_validate(address.as_str()) {
        Ok(checked) => true,
        Err(_) => false,
    }
}

pub fn parse_reply_instantiate_data(
    msg: Reply,
) -> Result<MsgInstantiateContractResponse, ContractError> {
    let data = msg
        .result
        .into_result()
        .map_err(ContractError::SubMsgFailure{})?
        .data
        .ok_or_else(|| ParseReplyError::ParseFailure("Missing reply data".to_owned()))?;
    parse_instantiate_response_data(&data.0)
}