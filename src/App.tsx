import { useMachine } from '@xstate/react';
import { useQueryClient } from 'react-query';
import * as API from './utils/api';
import { publicContract } from './utils/public-contract';
import { metamaskOnboardMachine } from './machines/metamask-onboard-machine';
import { WaveComposer } from './components/wave-composer';
import { WaveList } from './components/wave-list';
import { TopWaverBanner } from './components/top-waver-banner';

function App() {
  const [current, send] = useMachine(metamaskOnboardMachine, {
    devTools: true,
  });
  const queryClient = useQueryClient();

  publicContract.on(
    'NewWave',
    (from: string, timestamp: number, message: string) => {
      queryClient.setQueryData<API.Wave[]>('waves', (waves) => [
        { address: from, timestamp: new Date(timestamp * 1000), message },
        ...(waves || []),
      ]);
      queryClient.setQueryData<number>(
        'waveCount',
        (count) => (count ?? 0) + 1
      );
    }
  );

  return (
    <div className="container mx-auto p-4 sm:p-10">
      <div className="max-w-md mx-auto flex flex-col items-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 text-center">
          👋 Hey there!
        </h1>
        <p className="text-gray-600 max-w-md">
          I am Andres and I am learning about web3 and smart contracts. Wave at
          me by sending a message and you may win some ETH in the process!
        </p>
        <div className="space-x-2 h-24 w-full ml-auto flex items-center">
          {current.matches('checkingMetamaskInstallation') ? (
            <div className="mx-auto text-gray-500 flex items-center">
              <span>Checking Metamask installation</span>
              <svg
                className="animate-spin ml-3 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          ) : current.matches('metamaskNotInstalled') ? (
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Metamask is not installed
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      You will need the Metamask browser extension to send a
                      wave!
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="-mx-2 -my-1.5 flex">
                      <button
                        type="button"
                        className="bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
                        onClick={() => send('RETRY_METAMASK_CHECK')}
                      >
                        I downloaded the extension, check again
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : ['waitingForWallet', 'connectingWallet'].some(current.matches) ? (
            <button
              className="px-4 py-2 rounded-xl bg-gray-200"
              onClick={() => send('CONNECT_WALLET')}
            >
              {current.matches('connectingWallet')
                ? 'Continue in Metamask 🦊'
                : 'Connect Wallet'}
            </button>
          ) : current.matches('checkingIfWalletIsConnected') ? (
            <div className="mx-auto text-gray-500 flex items-center">
              <span>Loading wallet</span>
              <svg
                className="animate-spin ml-3 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          ) : current.matches('walletConnected') ? (
            <WaveComposer
              contract={current.context.contract!}
              account={current.context.account!}
            />
          ) : (
            'Unhandled state!'
          )}
        </div>
      </div>
      <div className="max-w-md mx-auto mt-8">
        <div className="mt-8 pb-16">
          <WaveList />
        </div>
      </div>
      <TopWaverBanner />
    </div>
  );
}

export default App;
