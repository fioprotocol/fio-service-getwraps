/**
 * Gets "custodian" events from the erc20 contract. Requires a .env file with:
 *   ethInfura=https://mainnet.infura.io/v3/<key>
 *   erc20Contract=<contractaddress>
 */

//const Web3 = require('web3');

import Web3 from 'web3';
import dotenv from 'dotenv';
dotenv.config();

const { ethInfura, erc20Contract } = process.env;

console.log('eth: ', erc20Contract)

const web3 = new Web3(ethInfura);
//import * as erc20ABI from './contracts/erc20.json';
//const erc20ABI = require("./Contracts/ERC20.json");
import erc20ABI from './contracts/erc20.json' assert { type: 'JSON' };
//const erc20ABI = await fetch('contracts/erc20.json')

//import { readFile } from 'fs/promises';

const erc20ABI = JSON.parse(await readFile(new URL('./contracts/erc20.json', import.meta.url)));


const wfioContract = new web3.eth.Contract(erc20ABI, erc20Contract);

//const lastBlockNumber = await web3.eth.getBlockNumber()


const getWraps = async () => {

  //console.log('lastblock: ', lastBlockNumber)
  

  try {
    let approvals = [];

    const transactions = await wfioContract.getPastEvents('consensus_activity', {
        fromBlock: 0,
        toBlock: 'latest'
    })

    let i = 0;
    for (txn in transactions) {
        if (transactions[txn].returnValues.signer === 'custodian') {
          approvals[i] = {"account": transactions[txn].returnValues.account, "indexhash": transactions[txn].returnValues.indexhash};
          i++;
        }
    }
    
    approvals.sort();

    let currentAcct;
    approvals.forEach(function (approval, index) {
      if (approval.account != currentAcct) {
        currentAcct = approval.account;
        console.log("Account: ", currentAcct);
        console.log("    Approval: ", approval.indexhash);
      } else {
        console.log("    Approval: ", approval.indexhash);
      }
    });

      
  } catch (err) {
      console.log('Error: ', err);
  }

}

getWraps();