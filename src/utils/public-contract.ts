import { ethers } from 'ethers';
import { contractAddress, contractABI } from './constants';

const provider = new ethers.providers.EtherscanProvider(
  'rinkeby',
  process.env.REACT_APP_ETHERSCAN_API_KEY
);

/** Uses the public Etherscan provider on the Rinkeby testnet */
export const publicContract = new ethers.Contract(
  contractAddress,
  contractABI,
  provider
);
