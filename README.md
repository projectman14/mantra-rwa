# Token Land

#### Overview
* Cosmos based CDP (collateral debt  protocol) with paymaster implementation to reduce gas fees.
* Automated loan smart contracts which can accept payment from any token.
* Stake RWAs as collateral for loans.
* We've used ts code-gen to streamline building the frontend process.

#### System Design (how it works)
![system-design-readme](https://github.com/projectman14/mantra-rwa/assets/138717001/4b16172a-574a-4e00-a38e-f00e985d6b00)


#### Steps to run it locally

* First make sure WSL is installed on your pc and a cosmos compatible wallet like Kepler wallet.
* Create a new folder and open it in text editor of your choice
* Switch to wsl environment and type `git clone --branch <branch name> https://github.com/projectman14/mantra-rwa.git` in terminal.
* Type `cd mantra-rwa/`
* Type `npm i` to install dependencies.
* Run `npm run dev` command
