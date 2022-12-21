# fio-services-getwraps

A service to get token wrap events on the Ethereum ERC-20 wFIO contract.

## Environment variables

Include a .env file with:

```
ethInfura=           # Ethereum API service (e.g., https://mainnet.infura.io/v3/<key>)
erc20Contract=       # The erc20 contract (e.g., 0xbEA269038Eb75BdAB47a9C04D0F5c572d94b93D5)
```

## Usage

```
npm run get-wraps     # Get recent FIO token wrap transactions

```