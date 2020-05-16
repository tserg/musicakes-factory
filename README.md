# Funds Distribution Token for ERC20 payment

Test implementation of ERC-2222 with ERC20 tokens as payment/dividends. Code adapted from: https://github.com/atpar/funds-distribution-token/tree/master/contracts/external/math

This is a Funds Distribution Token (FDT) that allows a contract to receive payment in an ERC20 token, and allow its owners to claim a proportion of the payments received by the token contract based on their percentage ownership.

For example, if 100 X tokens were paid, and Alice owns 10 out of 100 FDT, Alice can withdraw (10/100) * 100 = 10 X tokens.

In this implementation, FDT is capped at 100 with 0 decimal places. Each FDT therefore represents 1%.

## Getting Started

### Prerequisites & Installation

#### Installing Node and NPM

This project depends on Nodejs and Node Package Manager (NPM). Before continuing, you must download and install Node (the download includes NPM) from [https://nodejs.com/en/download](https://nodejs.org/en/download/).

#### Installing Truffle

This project uses Truffle as the development environment. You can download and install Truffle from [https://www.trufflesuite.com/docs/truffle/getting-started/installation]

#### Installing Ganache CLI

This project uses Ganache CLI as the development blockchain. You can download Ganache CLI by following the instructions at [https://github.com/trufflesuite/ganache-cli].

### Setup

Navigate to this folder and run `npm install `

## Local Development

1. Launch ganache-cli by running `ganache-cli` in your terminal.
2. Copy and paste the first wallet address, and use it to replace <<ADDRESS>> in the `2_deploy_contract.js` file under the `migrations` folder. This is the address that will be used to deploy the contract and will be the owner of the contract.
```
module.exports = function(deployer) {
  deployer.deploy(FDT_ERC20Extension, "MSC", "Musicakes", "<<ADDRESS>>");

};
```
3. In a separate terminal, navigate to this folder and run the following commands:
```
truffle compile
truffle migrate
```
4. Upon successful migration, run `npm run dev` to load the frontend at `localhost:3000`.

## Authors

Gary Tse (only minor adjustments)

## Acknowledgements

Code adapted from atpar (Actus Protocol): https://github.com/atpar/funds-distribution-token/tree/master/contracts/external/math