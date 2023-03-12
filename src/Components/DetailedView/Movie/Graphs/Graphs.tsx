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
  const moviesToDisplay = window.innerWidth > 400 ? 10 : 5;

  const [collectionData, setCollectionData] = useState<CollectionData>();
  const [displayedData, setDisplayedData] = useState<Movie[]>();
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

  useEffect(() => {
    if (collectionData && !('status_message' in collectionData))
      setDisplayedData(collectionData.parts.slice(0, moviesToDisplay));
  }, [collectionData, moviesToDisplay]);

  const handlePrevClick = () => {
    if (
      collectionData &&
      !('status_message' in collectionData) &&
      displayedData
    ) {
      const endingValue = collectionData.parts.findIndex(
        (obj) => obj.id === displayedData[0].id
      );

      setDisplayedData(
        collectionData.parts.slice(
          endingValue - moviesToDisplay >= 0
            ? endingValue - moviesToDisplay
            : 0,
          endingValue
        )
      );
    }
  };

  const handleNextClick = () => {
    if (
      collectionData &&
      !('status_message' in collectionData) &&
      displayedData
    ) {
      const startingValue = collectionData.parts.findIndex(
        (obj) => obj.id === displayedData[displayedData.length - 1].id
      );

      setDisplayedData(
        collectionData.parts.slice(
          startingValue + 1,
          startingValue + moviesToDisplay + 1 <= collectionData.parts.length
            ? startingValue + moviesToDisplay + 1
            : collectionData.parts.length
        )
      );
    }
  };

  if (error) return <p className={styles.error}>{error.message}</p>;
  if (collectionData && 'status_message' in collectionData)
    return <p className={styles.error}>{collectionData.status_message}</p>;

  return fetchComplete ? (
    <div className={styles.collection}>
      <p>{collectionData?.name || 'Standalone Movie'}</p>
      {collectionData && collectionData.parts.length > moviesToDisplay && (
        <div className={styles.nav}>
          <button
            disabled={
              displayedData &&
              displayedData[0].id === collectionData.parts[0].id
            }
            type='button'
            onClick={handlePrevClick}
          >
            Previous {moviesToDisplay}
          </button>
          <button
            disabled={
              displayedData &&
              displayedData[displayedData.length - 1].id ===
                collectionData.parts[collectionData.parts.length - 1].id
            }
            type='button'
            onClick={handleNextClick}
          >
            Next {moviesToDisplay}
          </button>
        </div>
      )}
      <LineGraph
        data={displayedData || [movieData]}
        xAxisDataKey='title'
        xAxisLabel='Movie Title'
        highlightDot={movieData}
        allowClick={!!collectionData}
      />
    </div>
  ) : null;
};
export default Graphs;
