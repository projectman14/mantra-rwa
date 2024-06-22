# Token Land

#### Overview
* Cosmos based CDP (collateral debt  protocol) with paymaster implementation to reduce gas fees.
* Automated loan smart contracts which can accept payment from any token.
* Stake RWAs as collateral for loans.
* We've used ts code-gen to streamline building the frontend process.

#### System Design (how it works)
![architecture design](./public/system-design-readme.png/ "architecture design")

#### Steps to run it locally

* First make sure WSL is installed on your pc and a cosmos compatible wallet like Keplr wallet.
* Create a new folder and open it in text editor of your choice
* Switch to wsl environment and type `git clone --branch <branch name> https://github.com/projectman14/mantra-rwa.git` in terminal.
* Type `cd mantra-rwa/`
* Type `npm i` to install dependencies.
* Run `npm run dev` command

#### How to use the website?

* First connect to Keplr walllet using `connect` button.
* Add our Cipher(CPR) token which is a cw20 token by selecting add token option in Keplr wallet.
* Select MANTRA Hongbai Testnet from dropdown options and add token using this contract address `mantra1lm9fah5umqde5vyppeleklk48j6s7t73psrerkr9n39gr5uman6q5v2qfj`
* Once CPR token has been added click on `Borrow Token` button and fill up your loan details form.
* Click on `Apply For Loan` once all details have been filled.
* Go to admin dashboard https://tokenland.vercel.app/admin
* Admin dashboard displays list of all pending loan approvals.
* Accept or Reject the loan.
* Go to our homepage and click on `List Loan Status` to view loans corresponding to your wallet address.
* Enter the amount you want pay and click on `Pay Now`. Wait a few sec for the staus to update.
* You can check the amount of CPR tokens on your Keplr wallet.

##### Using our Paymaster

* Go to homepage and click on `PayMaster`
* Click on `Get Me One` to setup paymaster for your loans.
* Enter the amount to auto pay and its frequency.
* Click on `Setup Now` and wait a few sec for it to set up.
* Click on `TokenLand Paymaster` at top of screen to go back.
* Click on `PayMaster Status` to view the list of your pay masters.
* You can remove it by clicking on `Remove` button.

### Contract Addresses for reference

* Database Address: `mantra19u9j7yhj4ueqmnnw8xzw6ppxs4egugzuvljqqtx5ksrzfcaqp3uqxnrqpz`
* Cipher(CPR) coin Address: `mantra1lm9fah5umqde5vyppeleklk48j6s7t73psrerkr9n39gr5uman6q5v2qfj`
* Paymaster factory Address: `mantra163dn7sa2385k95p5ujjwv5vqazw3lgsghpatmtlchdcmnj6zfvgs8nk46q`
* PBK token Address: `mantra1fs0hmqgwemluzjr4q5s3l4eatp3u0jcj2kjafmqrk3375armfd2ss84d9t`
  
#### How our PayMaster works?

[explanation to be added]