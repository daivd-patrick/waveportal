import { useMachine } from '@xstate/react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { wavePortalMachine } from './wave-portal.machine';

function App() {
  const [current, send] = useMachine(wavePortalMachine, { devTools: true });
  const queryClient = useQueryClient();
  const waveDataQuery = useQuery<number>(
    'waveData',
    async () => {
      const count = await current.context.contract!.getTotalWaves();
      return count.toNumber();
    },
    { enabled: Boolean(current.context.contract) }
  );
  const waveMutation = useMutation(async () => {
    const waveTxn = await current.context.contract!.wave();
    await waveTxn.wait();
    const data = queryClient.getQueryData<number>('waveData');
    queryClient.setQueryData('waveData', data! + 1);
    queryClient.invalidateQueries('waveData');
  });

  return (
    <div className="max-w-md mx-auto p-10">
      <div className="flex flex-col items-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 text-center">
          👋 Hey there!
        </h1>
        <p className="text-gray-600 max-w-md">
          I am Andres and I am learning web3 and smart contracts!
        </p>
        <div className="space-x-2 ml-auto">
          {['waitingForWallet', 'connectingWallet'].some(current.matches) && (
            <button
              className="px-4 py-2 rounded-xl bg-gray-200"
              onClick={() => send('CONNECT_WALLET')}
            >
              {current.matches('connectingWallet')
                ? 'Continue in Metamask 🦊'
                : 'Connect Wallet'}
            </button>
          )}
          {current.matches('checkingIfWalletIsConnected') && (
            <div>Loading wallet...</div>
          )}
          {current.matches('idle') && (
            <button
              className="px-4 py-2 rounded-xl bg-blue-600 text-white"
              onClick={() => waveMutation.mutate()}
              disabled={waveMutation.isLoading}
            >
              {waveMutation.isLoading ? 'Mining...' : 'Wave at me!'}
            </button>
          )}
        </div>
      </div>
      {current.matches('idle') && (
        <>
          <div>Account: {current.context.account}</div>
          <div>
            {waveDataQuery.isLoading
              ? 'Loading wave data...'
              : waveDataQuery.isError
              ? 'There was an error fetching wave data :('
              : `Total waves: ${waveDataQuery.data}`}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
