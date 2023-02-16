import { useEffect, useState } from 'react';
import { ApiError, DetailedMovie, Movie } from '../../../../interfaces';
import LineGraph from '../../LineGraph/LineGraph';
import fetchGraphData from './fetchGraphData';
import styles from './Graphs.module.css';

interface GraphsProps {
  movieData: DetailedMovie;
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

const Graphs = ({ movieData }: GraphsProps) => {
  const [collectionData, setCollectionData] = useState<CollectionData>();
  const [fetchComplete, setFetchComplete] = useState<boolean>(false);
  const [error, setError] = useState<Error | false>(false);

  useEffect(() => {
    const abortController = new AbortController();

    (async (): Promise<void> => {
      if (!collectionData && movieData.belongs_to_collection !== null) {
        const data = await fetchGraphData(
          movieData.belongs_to_collection.id,
          abortController.signal
        );

        setError(false);
        setCollectionData(data);
      }
      setFetchComplete(true);
    })().catch((err: Error) => setError(err));
    return () => abortController.abort();
  }, [movieData.belongs_to_collection, collectionData]);

  if (error) return <p className={styles.error}>{error.message}</p>;
  if (collectionData && 'status_message' in collectionData)
    return <p className={styles.error}>{collectionData.status_message}</p>;

  return fetchComplete ? (
    <div className={styles.collection}>
      <p>{collectionData?.name || 'Standalone Movie'}</p>
      <LineGraph
        data={collectionData?.parts || [movieData]}
        xAxisDataKey='title'
        xAxisLabel='Movie Title'
        highlightDot={movieData}
        allowClick={!!collectionData}
      />
    </div>
  ) : null;
};
export default Graphs;
