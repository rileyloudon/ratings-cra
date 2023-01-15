import { useEffect, useState } from 'react';
import { ApiError, DetailedTv, Season } from '../../../../interfaces';
import LineGraph from '../../LineGraph/LineGraph';
import fetchGraphData from './fetchGraphData';
import styles from './Graphs.module.css';

interface GraphsProps {
  tvData: DetailedTv;
}

type SeasonData = Season | ApiError;

const Graphs = ({ tvData }: GraphsProps) => {
  const [seasonData, setSeasonData] = useState<SeasonData>();
  const [seasonSelector, setSeasonSelector] = useState<string>('season/1');

  const [error, setError] = useState<Error>();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSeasonSelector(e.target.value);

  useEffect(() => {
    (async (): Promise<void> => {
      if ('number_of_seasons' in tvData) {
        const data = await fetchGraphData(tvData.id, tvData.number_of_seasons);
        setSeasonData(data);
      }
    })().catch((err: Error) => setError(err));
  }, [tvData]);

  if (error) return <p>{error.message}</p>;
  if (seasonData && 'status_message' in seasonData)
    return <p>{seasonData.status_message.toString()}</p>;

  const seasonOptions = Array.from(
    { length: tvData.number_of_seasons },
    (x, i) => `Season ${i + 1}`
  );

  return (
    <div className={styles.episodes}>
      <div className={styles.dropdown}>
        <select name='season' id='season' onChange={handleChange}>
          {seasonOptions.map((seasonNumber, i) => (
            <option key={seasonNumber} value={`season/${i + 1}`}>
              {seasonNumber}
            </option>
          ))}
        </select>
      </div>
      {seasonData && seasonData[seasonSelector].episodes.length && (
        <LineGraph
          data={seasonData[seasonSelector].episodes}
          xAxisLabel='name'
        />
      )}
    </div>
  );
};
export default Graphs;
