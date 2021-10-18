import { Wave } from '../utils/api';
import { AccountAvatar } from './account-avatar';

export function WaveListItem({ wave }: { wave: Wave }) {
  return (
    <li className="space-x-2 flex">
      <AccountAvatar
        className="w-10 h-10 flex-shrink-0 inline-block"
        account={wave.address}
      />
      <div className="inline-block relative rounded-2xl px-6 py-4 bg-gray-200 w-full">
        <a
          href={`https://rinkeby.etherscan.io/address/${wave.address}`}
          target="_blank"
          rel="noreferrer"
        >
          <small className="font-mono text-gray-600 hover:text-blue-500 hover:underline font-medium">
            {wave.address}
          </small>
        </a>
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
}
