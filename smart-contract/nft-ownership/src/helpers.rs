use cosmwasm_std::{to_json_binary, Addr, CosmosMsg, StdResult, WasmMsg, Deps};

use cosmwasm_schema::cw_serde;

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