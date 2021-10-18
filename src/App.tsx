import { useMachine } from '@xstate/react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { wavePortalMachine } from './wave-portal.machine';

function App() {
  const [current, send] = useMachine(wavePortalMachine, { devTools: true });
  const queryClient = useQueryClient();
  const waveCountQuery = useQuery<number>(
    'waveCount',
    async () => {
      const count = await current.context.contract!.getTotalWaves();
      return count.toNumber();
    },
    { enabled: Boolean(current.context.contract) }
  );
  const waveMutation = useMutation(async () => {
    const waveTxn = await current.context.contract!.wave(
      current.context.message
    );
    await waveTxn.wait();
    const data = queryClient.getQueryData<number>('waveCount');
    queryClient.setQueryData('waveCount', data! + 1);
    queryClient.invalidateQueries('waveCount');
    queryClient.invalidateQueries('waves');
    send('CLEAR_MESSAGE');
  });
  const wavesQuery = useQuery<
    { address: string; timestamp: Date; message: string }[]
  >(
    'waves',
    async () => {
      const waves = await current.context.contract!.getAllWaves();
      console.log(waves);
      return waves.map(
        (wave: { waver: string; timestamp: number; message: string }) => ({
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message,
        })
      );
    },
    { enabled: Boolean(current.context.contract) }
  );

  return (
    <div className="container mx-auto p-10">
      <div className="max-w-md mx-auto flex flex-col items-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 text-center">
          👋 Hey there!
        </h1>
        <p className="text-gray-600 max-w-md">
          I am Andres and I am learning web3 and smart contracts!
        </p>
        <div className="space-x-2 w-full ml-auto">
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
            <div className="flex items-center space-x-2 w-full">
              <input
                type="text"
                name="email"
                id="email"
                className="flex-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Send a message!"
                value={current.context.message}
                onChange={(e) => {
                  send({
                    type: 'UPDATE_MESSAGE',
                    value: e.target.value,
                  } as any);
                }}
              />
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 rounded-xl hover:bg-blue-600 text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                onClick={() => waveMutation.mutate()}
                disabled={waveMutation.isLoading}
              >
                {waveMutation.isLoading ? 'Mining...' : 'Send 👋'}
              </button>
            </div>
          )}
        </div>
      </div>
      {current.matches('idle') && (
        <div className="max-w-md mx-auto mt-8">
          <div>Account: {current.context.account}</div>
          <div>
            {waveCountQuery.isLoading
              ? 'Loading wave data...'
              : waveCountQuery.isError
              ? 'There was an error fetching wave data :('
              : `Total waves: ${waveCountQuery.data}`}
          </div>
          <ul className="mt-8 space-y-4">
            {wavesQuery.isLoading
              ? 'Loading waves...'
              : wavesQuery.isError
              ? 'Error fetching waves feed :('
              : wavesQuery.data!.length === 0
              ? 'Be the first to wave!'
              : wavesQuery.data!.map((wave) => (
                  <li
                    key={wave.address + wave.timestamp.toISOString()}
                    className="rounded-2xl px-6 py-4 bg-gray-200"
                  >
                    <div>Address: {wave.address}</div>
                    <div>Time: {wave.timestamp.toString()}</div>
                    <div>Message: {wave.message}</div>
                  </li>
                ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
