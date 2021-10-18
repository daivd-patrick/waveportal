import { useMachine } from '@xstate/react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { publicContract } from './utils/public-contract';
import { wavePortalMachine } from './wave-portal.machine';

interface Wave {
  address: string;
  timestamp: Date;
  message: string;
}

function App() {
  const [current, send] = useMachine(wavePortalMachine, { devTools: true });
  const queryClient = useQueryClient();
  const waveCountQuery = useQuery<number>(
    'waveCount',
    async () => {
      const count = await publicContract.getTotalWaves();
      return count.toNumber();
    },
    { enabled: Boolean(current.context.contract) }
  );
  const waveMutation = useMutation('waveMutation', async () => {
    const waveTxn = await current.context.contract!.wave(
      current.context.message,
      { gasLimit: 300000 }
    );
    await waveTxn.wait();
    const data = queryClient.getQueryData<number>('waveCount');
    queryClient.setQueryData('waveCount', data! + 1);
    queryClient.invalidateQueries('waveCount');
    queryClient.invalidateQueries('waves');
    send('CLEAR_MESSAGE');
  });
  const wavesQuery = useQuery<Wave[]>(
    'waves',
    async () => {
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
    },
    { enabled: Boolean(current.context.contract) }
  );

  return (
    <div className="container mx-auto p-4 sm:p-10">
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
              : wavesQuery.data!.map((wave) => {
                  const from = wave.address.substr(2, 6);
                  const to = wave.address.substr(wave.address.length - 6);

                  return (
                    <li
                      key={wave.address + wave.timestamp.toISOString()}
                      className="space-x-2 flex"
                    >
                      <div
                        className="w-10 h-10 flex-shrink-0 rounded-full inline-block"
                        style={{
                          backgroundImage: `linear-gradient(to bottom, #${from}, #${to})`,
                        }}
                      />
                      <div className="inline-block relative rounded-2xl px-6 py-4 bg-gray-200 w-full">
                        <small className="font-mono text-gray-600 font-medium">
                          {wave.address}
                        </small>
                        <div className="my-2">{wave.message}</div>
                        <time
                          dateTime={wave.timestamp.toISOString()}
                          className="absolute bottom-3 right-3 text-xs text-gray-600"
                        >
                          {
                            [
                              'Jan.',
                              'Feb.',
                              'Mar.',
                              'Apr.',
                              'May',
                              'Jun.',
                              'Jul.',
                              'Aug.',
                              'Sep.',
                              'Oct.',
                              'Nov.',
                              'Dec.',
                            ][wave.timestamp.getMonth()]
                          }{' '}
                          {wave.timestamp.getDay()}
                          {2020 !== new Date().getFullYear() &&
                            `, ${wave.timestamp.getFullYear()}`}
                        </time>
                      </div>
                    </li>
                  );
                })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
