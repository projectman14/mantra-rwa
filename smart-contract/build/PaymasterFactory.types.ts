export interface InstantiateMsg {
  code_id: number;
}
export type ExecuteMsg = {
  mint_paymaster_account: {
    address: Addr;
  };
};
export type Addr = string;
export type QueryMsg = {
  get_paymaster_address: {
    address: Addr;
  };
};