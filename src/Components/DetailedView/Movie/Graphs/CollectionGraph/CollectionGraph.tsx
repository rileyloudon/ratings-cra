import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ApiError, Movie } from '../../../../../interfaces';
import fetchCollectionData from './fetchCollectionData';
import styles from './CollectionGraph.module.css';

interface CollectionGraphProps {
  CollectionId?: number;
}

interface Collection {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  parts: Movie[];
}

type CollectionData = Collection | ApiError;

const CollectionGraph = ({
  CollectionId = undefined,
}: CollectionGraphProps) => {
  const [collectionData, setCollectionData] = useState<CollectionData>();
  const [error, setError] = useState<Error>();

  const tickFormatter = (value: string): string => {
    const limit = 20;
    if (value.length < limit) return value;
    return `${value.substring(0, limit)}...`;
  };

  useEffect(() => {
    (async (): Promise<void> => {
      if (!collectionData) {
        const data = await fetchCollectionData(CollectionId);
        console.log(data);

        setCollectionData(data);
      }
    })().catch((err: Error) => setError(err));
  }, [CollectionId, collectionData]);

  if (error) return <p>{error.message}</p>;
  if (!collectionData) return null;

  if ('status_message' in collectionData)
    return <p>{collectionData.status_message}</p>;

  return (
    <div>
      <p className={styles.name}>{collectionData.name}</p>
      <ResponsiveContainer width='100%' height={400}>
        <LineChart
          // Key makes sure animation works
          key={Math.random()}
          data={collectionData.parts}
          margin={{
            top: 5,
            right: 100,
            left: 100,
            bottom: 50,
          }}
        >
          <Line name='Average' dataKey='vote_average' stroke='var(--text)' />
          <XAxis
            tick={{ fill: 'var(--text)' }}
            dataKey='title'
            interval={0}
            tickFormatter={tickFormatter}
            angle={315}
          />
          <YAxis
            tick={{ fill: 'var(--text)' }}
            type='number'
            domain={[0, 10]}
            tickCount={6}
            allowDataOverflow={false}
          />
          <Tooltip
            wrapperClassName={styles['tooltip-wrapper']}
            contentStyle={{ backgroundColor: 'var(background)' }}
          />
          <CartesianGrid strokeDasharray='2 1' opacity='50%' />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CollectionGraph;
