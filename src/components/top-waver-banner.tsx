import { useQuery, useQueryClient } from 'react-query';
import { getTopWaver } from '../utils/api';
import { publicContract } from '../utils/public-contract';
import { AccountAvatar } from './account-avatar';

export function TopWaverBanner() {
  const topWaverQuery = useQuery('topWaver', getTopWaver);
  const queryClient = useQueryClient();

  if (topWaverQuery.isLoading || topWaverQuery.data?.waves === 0) return null;

  publicContract.on('NewTopWaver', ({ waver, waves }) => {
    queryClient.setQueryData('topWaver', () => ({
      waver,
      waves: waves.toNumber(),
    }));
  });

  const { waver, waves } = topWaverQuery.data!;

  return (
    <div className="fixed bottom-0 inset-x-0 pb-2 sm:pb-5">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="p-2 rounded-lg bg-indigo-600 shadow-lg sm:p-3">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-indigo-800">
                <AccountAvatar
                  className="h-6 w-6 border border-white"
                  account={waver}
                />
              </span>
              <p className="ml-3 font-medium text-white truncate">
                <span className="md:hidden">
                  Top waver is{' '}
                  <a href={`https://rinkeby.etherscan.io/address/${waver}`}>
                    <div className="inline-block bg-indigo-800 py-1 px-2 rounded-lg hover:underline text-sm font-mono">
                      {waver.substr(0, 4)}...{waver.substr(waver.length - 4)}
                    </div>
                  </a>{' '}
                  with {waves} {waves === 1 ? 'wave' : 'waves'} 👋
                </span>
                <span className="hidden md:inline">
                  Top waver is{' '}
                  <a
                    href={`https://rinkeby.etherscan.io/address/${waver}`}
                    className="hover:underline text-sm font-mono"
                  >
                    <div className="inline-block bg-indigo-800 py-1 px-2 rounded-lg hover:underline text-sm font-mono">
                      {waver}
                    </div>
                  </a>{' '}
                  with {waves} {waves === 1 ? 'wave' : 'waves'}!
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
