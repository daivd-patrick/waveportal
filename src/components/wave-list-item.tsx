import { Wave } from '../utils/api';
import { AccountAvatar } from './account-avatar';

export function WaveListItem({ wave }: { wave: Wave }) {
  return (
    <li className="flex space-x-2">
      <AccountAvatar
        className="flex-shrink-0 inline-block w-10 h-10"
        account={wave.address}
      />
      <div className="relative inline-block w-full px-6 py-4 bg-gray-200 rounded-2xl">
        <a
          href={`https://rinkeby.etherscan.io/address/${wave.address}`}
          target="_blank"
          rel="noreferrer"
        >
          <small className="hidden font-mono font-medium text-gray-600 md:inline hover:text-blue-500 hover:underline">
            {wave.address}
          </small>
          <small className="font-mono font-medium text-gray-600 hover:text-blue-500 hover:underline md:hidden">
            {wave.address.substr(0, 4)}...
            {wave.address.substr(wave.address.length - 4)}
          </small>
        </a>
        <div className="my-2">{wave.message}</div>
        <time
          dateTime={wave.timestamp.toISOString()}
          className="absolute text-xs text-gray-600 bottom-3 right-3"
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
          {wave.timestamp.getFullYear() !== new Date().getFullYear() &&
            `, ${wave.timestamp.getFullYear()}`}
        </time>
      </div>
    </li>
  );
}
