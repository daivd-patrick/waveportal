import { useQuery, useQueryClient } from 'react-query';
import { getAllWaves, Wave } from '../utils/api';
import { publicContract } from '../utils/public-contract';
import { WaveListItem } from './wave-list-item';

export function WaveList() {
  const queryClient = useQueryClient();
  const wavesQuery = useQuery('waves', getAllWaves);

  publicContract.on(
    'NewWave',
    (from: string, timestamp: number, message: string) => {
      queryClient.setQueryData<Wave[]>('waves', (waves) => [
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
    <ul className="space-y-4">
      {wavesQuery.isLoading
        ? 'Loading waves...'
        : wavesQuery.isError
        ? 'Error fetching waves feed :('
        : wavesQuery.data!.length === 0
        ? 'Be the first to wave!'
        : wavesQuery.data!.map((wave) => (
            <WaveListItem
              key={wave.address + wave.timestamp.toISOString()}
              wave={wave}
            />
          ))}
    </ul>
  );
}
