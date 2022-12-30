/**
 * Gets "wrapped" events from the erc20 contract. 
 * 
 * Requires a .env file with:
 *   ethInfura=https://mainnet.infura.io/v3/<key>
 *   erc20Contract=<contractaddress>
 * 
 * Recommend run interval: every 30 minutes
 * Console logs: send to discord if wrap occurs. Do not send to discord if 'No token wraps' is returned.
 */

import Web3 from 'web3';
import dotenv from 'dotenv';
import { erc20ABI } from './contracts/erc20.js';
dotenv.config();

const { ethInfura, erc20Contract } = process.env;

const web3 = new Web3(ethInfura);
const wfioContract = new web3.eth.Contract(erc20ABI, erc20Contract);

const lastBlockNumber = await web3.eth.getBlockNumber();

function toDateTime(secs) {
  var t = new Date(1970, 0, 1);
  t.setSeconds(secs);
  return t.toLocaleDateString('en-US');
}

const getWraps = async () => {

  const blocksPer30Min = 150;  // Approximate number of blocks ever 30 minutes on Ethereum
  const threshold = 1000000000000;   // Sends warning for unwraps > 1000 FIO
  const billion = 1000000000;
  let wrap, wrapDate;
  let wraps = [];
  

  const wrapEvents = await wfioContract.getPastEvents('wrapped', {
      fromBlock: lastBlockNumber - blocksPer30Min,
      toBlock: 'latest'
  })

  if (wrapEvents.length > 0) {  
    for (wrap in wrapEvents) {
        let notice = "Wrap"
        const blockInfo = await web3.eth.getBlock(wrapEvents[wrap].blockNumber);
        wrapDate = toDateTime(blockInfo.timestamp);
        if ( wrapEvents[wrap].returnValues.amount > threshold ) { notice = "WARNING LARGE WRAP" }
        wraps.push([notice, wrapEvents[wrap].returnValues.account, wrapEvents[wrap].returnValues.amount, wrapDate]);
    }; 
  };

  // Output to conole
  if ( wraps.length == 0 ) {
    console.log('No token wraps')
  } else {
    wraps.forEach(element => {
      console.log(`${element[0]}: ${element[1]} wrapped ${element[2] / billion} FIO on ${element[3]}`);
    });
  }

}

getWraps();