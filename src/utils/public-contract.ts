import { ethers } from 'ethers';
import { contractAddress, contractABI } from './constants';

const provider = new ethers.providers.EtherscanProvider('rinkeby');

/** Uses the public Etherscan provider on the Rinkeby testnet */
export const publicContract = new ethers.Contract(
  contractAddress,
  contractABI,
  provider
);
