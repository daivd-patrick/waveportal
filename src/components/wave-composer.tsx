import { Contract } from '@ethersproject/contracts';
import { useMutation } from 'react-query';
import { AccountAvatar } from './account-avatar';
import { wave } from '../utils/api';
import { useState } from 'react';

export function WaveComposer({
  contract,
  account,
}: {
  contract: Contract;
  account: string;
}) {
  const [message, setMessage] = useState('');
  const waveMutation = useMutation('waveMutation', async () => {
    await wave(contract, message);
  });

  return (
    <div className="flex flex-col justify-center space-y-2 w-full">
      <div className="relative rounded-md shadow-sm flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <AccountAvatar className="h-5 w-5" account={account} />
        </div>
        <input
          type="text"
          name="message"
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
          placeholder="Send a message!"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
      </div>
      <div>
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 rounded-xl hover:bg-blue-600 text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          onClick={() => waveMutation.mutate()}
          disabled={waveMutation.isLoading}
        >
          {waveMutation.isLoading ? 'Mining...' : 'Send 👋'}
        </button>
      </div>
    </div>
  );
}
