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
  const [error, setError] = useState<Error>();

  useEffect(() => {
    (async (): Promise<void> => {
      if (!collectionData && movieData.belongs_to_collection !== null) {
        const data = await fetchGraphData(movieData.belongs_to_collection.id);
        setCollectionData(data);
      }
    })().catch((err: Error) => setError(err));
  }, [movieData.belongs_to_collection, collectionData]);

  if (error) return <p>{error.message}</p>;
  if (collectionData && 'status_message' in collectionData)
    return <p>{collectionData.status_message}</p>;

  return (
    <>
      <div className={styles.collection}>
        <p>{collectionData?.name}</p>
        {collectionData && 'parts' in collectionData && (
          <LineGraph data={collectionData.parts} xAxisLabel='title' />
        )}
      </div>
      {/* Other Graphs */}
    </>
  );
};
export default Graphs;
