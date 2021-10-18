import { Contract } from 'ethers';
import { publicContract } from './utils/public-contract';

export interface Wave {
  address: string;
  timestamp: Date;
  message: string;
}

export async function getWaveCount() {
  const count = await publicContract.getTotalWaves();
  return count.toNumber();
}

export async function wave(contract: Contract, message: string) {
  const waveTxn = await contract.wave(message, { gasLimit: 300000 });
  await waveTxn.wait();
  return;
}

export async function getAllWaves() {
  const waves = await publicContract.getAllWaves();

  let allWaves: Wave[] = [];

  for (const wave of waves) {
    allWaves = [
      {
        address: wave.waver,
        timestamp: new Date(wave.timestamp * 1000),
        message: wave.message,
      },
      ...allWaves,
    ];
  }

  return allWaves;
}
