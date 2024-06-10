//this directry is for smart contracts

Loan database -> Stores the loan contracts
Loan contract -> Works automatically to handle loans
Stable coin -> Coin that is given to the borrower, connected to a stable stock, currently set to USDC. Prices are fetched through Hongbai Oracle

Steps of Deployment: -
* Upload loan contract and note down it's code_id
* Upload loan database contract and instantiate it with loan_contract code_id
* Upload and instantiate stable coin contract and set loan database as minter
* Add the address of the cw20 token to loan database

This completes the infrastructure

NOTES: -
* Due to limitation on floating point operations, one extra token than the borrowed amount is given to cover up the remainder
* Smart contracts are event driven, so loan contracts must be invoked often to update their statuses
* # The admin and safety features have not been implemented for current development purposes
