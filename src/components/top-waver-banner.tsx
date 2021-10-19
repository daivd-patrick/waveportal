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
    <div className="fixed inset-x-0 bottom-0 pb-2 sm:pb-5">
      <div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="p-2 bg-indigo-600 rounded-lg shadow-lg sm:p-3">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center flex-1 w-0">
              <span className="flex p-2 bg-indigo-800 rounded-lg">
                <AccountAvatar
                  className="w-6 h-6 border border-white"
                  account={waver}
                />
              </span>
              <p className="ml-3 font-medium text-white truncate">
                <span className="text-sm md:hidden">
                  Top waver is{' '}
                  <a href={`https://rinkeby.etherscan.io/address/${waver}`}>
                    <div className="inline-block px-2 py-1 font-mono text-sm bg-indigo-800 rounded-lg hover:underline">
                      {waver.substr(0, 4)}...{waver.substr(waver.length - 4)}
                    </div>
                  </a>{' '}
                  with {waves} {waves === 1 ? 'wave' : 'waves'} 👋
                </span>
                <span className="hidden md:inline">
                  Top waver is{' '}
                  <a
                    href={`https://rinkeby.etherscan.io/address/${waver}`}
                    className="font-mono text-sm hover:underline"
                  >
                    <div className="inline-block px-2 py-1 font-mono text-sm bg-indigo-800 rounded-lg hover:underline">
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
