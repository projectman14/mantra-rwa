#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint128, Addr, Timestamp, Uint64, to_json_binary, QueryRequest, WasmQuery, WasmMsg, SubMsg};
use cw2::set_contract_version;

use cosmwasm_schema::cw_serde;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, AllPayments};
use crate::state::{ADMIN, PAYMASTERS, PAYMENTID, PayMaster};

const CONTRACT_NAME: &str = "crates.io:paymaster";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");
 

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    ADMIN.save(deps.storage, &msg.admin.to_owned())?;
    let paymaster_vec : Vec<PayMaster> = vec![];

    PAYMASTERS.save(deps.storage, &paymaster_vec)?;
    PAYMENTID.save(deps.storage, &Uint128::new(0))?;

    Ok(Response::new()
    .add_attribute("action", "Instantiated paymaster contract")
    .add_attribute("admin", msg.admin))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg{
        ExecuteMsg::AddPayment { receiver, token_symbol, token_address, decimals, amount, start_date, frequency_in_days } => execute::add_payment(deps, receiver, token_symbol, token_address, decimals, amount, start_date, frequency_in_days),
        ExecuteMsg::RemovePayment { payment_id } => execute::remove_payment(deps, payment_id),
        ExecuteMsg::UpdatePaymentStatus { } => execute::update_payment_status(deps, env),
    }
}

pub mod execute{
    use super::*;

    pub fn add_payment(deps : DepsMut, receiver : Addr, token_symbol : String, token_address : Addr, decimals : u32, amount : Uint64, start_date : Timestamp, frequency_in_days : u64 ) -> Result<Response, ContractError> {
        let mut id = PAYMENTID.load(deps.storage)?;

        let payment = PayMaster{
            payment_id : id.clone(),
            receiver : receiver.to_owned(),
            token_symbol : token_symbol.to_owned(),
            token_address : token_address.to_owned(),
            decimals,
            amount,
            frequency_in_days,
            next_payment_date : start_date,
        };

        let mut payment_info = PAYMASTERS.load(deps.storage)?;

        payment_info.push(payment);
        PAYMASTERS.save(deps.storage, &payment_info)?;

        id += Uint128::new(1);
        PAYMENTID.save(deps.storage, &id)?;

        Ok(Response::new()
        .add_attribute("action", "Add payment")
        .add_attribute("payment_id", id - Uint128::new(1))
        .add_attribute("token_address", token_address)
        .add_attribute("decimals", decimals.to_string())
        .add_attribute("amount", amount.to_string())
        .add_attribute("frequency_in_days", frequency_in_days.to_string())
        .add_attribute("start_date", start_date.to_string()))
    }

    pub fn remove_payment(deps : DepsMut, payment_id : Uint128) -> Result<Response, ContractError>{
        let mut payment_info = PAYMASTERS.load(deps.storage)?;

        let pos = payment_info.iter().position(|x| (*x).payment_id == payment_id);

        match pos {
            None => Err(ContractError::PaymentIdNotFound { payment_id: payment_id }),
            Some(pos) => {
                payment_info.remove(pos);

                PAYMASTERS.save(deps.storage, &payment_info)?;

                Ok(Response::new()
                .add_attribute("action", "Remove payment")
                .add_attribute("payment_id", payment_id.to_string()))
            }
        }
    }

    #[cw_serde]
    pub struct SendMsg{
        pub send : Send,
    }

    #[cw_serde]
    pub struct Send {
        pub contract: String,
        pub amount: Uint128,
        pub msg: Binary,
    }

    #[cw_serde]
    pub struct PaymentMsg {
        pub accept_payment : AcceptPayment,
    }

    #[cw_serde]
    pub struct AcceptPayment{
        pub payment : Uint64,
    }

    #[cw_serde]
    pub struct QueryPrice {
        pub get_price: GetPrice,
    }

    #[cw_serde]
    pub struct GetPrice {
        pub symbol: String,
    }

    #[cw_serde]
    pub struct PriceResponse {
        pub price: i64,
        pub expo: i32,
        pub timestamp: u64,
    }

    pub fn update_payment_status(deps : DepsMut, env : Env) -> Result<Response, ContractError>{
        let payment_info = PAYMASTERS.load(deps.storage)?;

        let mut update_vec : Vec<SubMsg> = vec![];

        for pay in payment_info.iter() {
            if env.block.time >= pay.next_payment_date {

                /*
                let stock_price_request = QueryRequest::Wasm(
                    WasmQuery::Smart {
                        contract_addr : "mantra1q44nqkfcude7je0tqhu0u8mm7x8uhgj73n94k2vkx87tsr6yaujsdu3s4a".to_string(),
                        msg : to_json_binary(&QueryPrice{
                            get_price : GetPrice { symbol : pay.token_symbol.to_owned() },
                        })?,
                    }
                ) ;

                let stock_price : PriceResponse = deps.querier.query(&stock_price_request)?;
                */

                let stock_price : PriceResponse = PriceResponse{
                    price : 1,
                    expo : 0,
                    timestamp : 10000,
                };

                let base: u64 = 10;
                let expo : u32 = stock_price.expo.try_into().unwrap();
                let price : u64 = stock_price.price.try_into().unwrap();

                let token_amount = Uint128::new((pay.amount.u64() * base.pow(expo) * base.pow(pay.decimals)) as u128)/Uint128::new(price as u128);

                let accept_payment = AcceptPayment{
                    payment : pay.amount,
                };

                let payment_msg = PaymentMsg{
                    accept_payment,
                };

                let send_msg = SendMsg{
                    send : Send {
                        contract : pay.receiver.to_string(),
                        amount : token_amount,
                        msg : to_json_binary(&payment_msg)?,
                    }
                };

                let sub_msg  = SubMsg::new(WasmMsg::Execute { contract_addr: pay.token_address.to_string(), msg: to_json_binary(&send_msg)?, funds: vec![] });

                update_vec.push(sub_msg)
            }
        }

        Ok(Response::new().add_submessages(update_vec))
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg{
        QueryMsg::GetPayments {  } => to_json_binary(&query::get_payments(deps)?),
        QueryMsg::GetPaymentByID { id } => to_json_binary(&query::get_payment_by_id(deps, id)?),
    }
}

pub mod query{
    use super::*;

    pub fn get_payments(deps : Deps) -> StdResult<AllPayments>{
        let all_payments = AllPayments{
            payments : PAYMASTERS.load(deps.storage)?,
        };

        Ok(all_payments)
    }

    pub fn get_payment_by_id(deps : Deps, id : Uint128) -> StdResult<PayMaster>{
        let payment_info = PAYMASTERS.load(deps.storage)?;

        let pos = payment_info.iter().position(|x| (*x).payment_id == id);

        match pos {
            None => Err(cosmwasm_std::StdError::NotFound { kind: "payment".to_string() }),
            Some(pos) => Ok(payment_info[pos].to_owned())
        }
    }
}

#[cfg(test)]
mod tests {}
