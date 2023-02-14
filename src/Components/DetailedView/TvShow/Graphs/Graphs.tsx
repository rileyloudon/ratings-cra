import { useEffect, useState } from 'react';
import { ApiError, DetailedTv, Episodes, Season } from '../../../../interfaces';
import LineGraph from '../../LineGraph/LineGraph';
import fetchGraphData from './fetchGraphData';
import styles from './Graphs.module.css';

interface GraphsProps {
  tvData: DetailedTv;
}

type SeasonData = Season | ApiError;

const Graphs = ({ tvData }: GraphsProps) => {
  const episodesToDisplay = 10;

  const [seasonData, setSeasonData] = useState<SeasonData>();
  const [seasonSelector, setSeasonSelector] = useState<string>('season/1');
  const [displayedData, setDisplayedData] = useState<Episodes[]>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    (async (): Promise<void> => {
      if ('number_of_seasons' in tvData) {
        const data = await fetchGraphData(tvData.id, tvData.number_of_seasons);
        setSeasonData(data);
      }
    })().catch((err: Error) => setError(err));
  }, [tvData]);

  useEffect(() => {
    if (
      seasonData &&
      !('status_message' in seasonData) &&
      seasonData[seasonSelector].episodes.length
    )
      setDisplayedData(
        seasonData[seasonSelector].episodes.slice(0, episodesToDisplay)
      );
  }, [seasonData, seasonSelector]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSeasonSelector(e.target.value);

  const handlePrevClick = () => {
    if (seasonData && !('status_message' in seasonData) && displayedData) {
      const { episodes } = seasonData[seasonSelector];

      const endingValue = episodes.findIndex(
        (obj) => obj.id === displayedData[0].id
      );

      setDisplayedData(
        episodes.slice(
          endingValue - episodesToDisplay >= 0
            ? endingValue - episodesToDisplay
            : 0,
          endingValue
        )
      );
    }
  };

  const handleNextClick = () => {
    if (seasonData && !('status_message' in seasonData) && displayedData) {
      const { episodes } = seasonData[seasonSelector];

      const startingValue = episodes.findIndex(
        (obj) => obj.id === displayedData[displayedData.length - 1].id
      );

      setDisplayedData(
        episodes.slice(
          startingValue + 1,
          startingValue + episodesToDisplay + 1 <= episodes.length
            ? startingValue + episodesToDisplay + 1
            : episodes.length
        )
      );
    }
  };

  if (error) return <p className={styles.error}>{error.message}</p>;
  if (seasonData && 'status_message' in seasonData)
    return (
      <p className={styles.error}>{seasonData.status_message.toString()}</p>
    );

  const seasonOptions = Array.from(
    { length: tvData.number_of_seasons },
    (x, i) => `Season ${i + 1}`
  );

  return (
    <div className={styles.episodes}>
      <select name='season' id='season' onChange={handleChange}>
        {seasonOptions.map((seasonNumber, i) => (
          <option key={seasonNumber} value={`season/${i + 1}`}>
            {seasonNumber}
          </option>
        ))}
      </select>
      {seasonData &&
        seasonData[seasonSelector].episodes.length > episodesToDisplay && (
          <div className={styles.nav}>
            <button
              disabled={
                displayedData &&
                displayedData[0].id ===
                  seasonData[seasonSelector].episodes[0].id
              }
              type='button'
              onClick={handlePrevClick}
            >
              Previous {episodesToDisplay}
            </button>
            <button
              disabled={
                displayedData &&
                displayedData[displayedData.length - 1].id ===
                  seasonData[seasonSelector].episodes[
                    seasonData[seasonSelector].episodes.length - 1
                  ].id
              }
              type='button'
              onClick={handleNextClick}
            >
              Next {episodesToDisplay}
            </button>
          </div>
        )}
      {displayedData && (
        <LineGraph
          data={displayedData}
          xAxisDataKey='name'
          xAxisLabel='Episode Name'
        />
      )}
    </div>
  );
};
export default Graphs;
