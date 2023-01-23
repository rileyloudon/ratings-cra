import { useState } from 'react';
import { Movie, TvShow } from '../../../../interfaces';
import LineGraph from '../../LineGraph/LineGraph';
import styles from './Graphs.module.css';

interface GraphsProps {
  credits: (Movie | TvShow)[];
}

const Graphs = ({ credits }: GraphsProps) => {
  const [displayedData, setDisplayedData] = useState<(Movie | TvShow)[]>(
    credits.slice(0, 5)
  );

  const handlePrevClick = () => {
    const endingValue = credits.findIndex(
      (obj) => obj.id === displayedData[0].id
    );

    setDisplayedData(
      credits.slice(endingValue - 5 >= 0 ? endingValue - 5 : 0, endingValue)
    );
  };

  const handleNextClick = () => {
    const startingValue = credits.findIndex(
      (obj) => obj.id === displayedData[displayedData.length - 1].id
    );

    setDisplayedData(
      credits.slice(
        startingValue + 1,
        startingValue + 6 <= credits.length ? startingValue + 6 : credits.length
      )
    );
  };

  return (
    <>
      <div className={styles.credits}>
        <p>Most Popular Credits</p>
        <div className={styles.nav}>
          <button
            disabled={displayedData[0].id === credits[0].id}
            type='button'
            onClick={handlePrevClick}
          >
            Previous 5
          </button>
          <button
            disabled={
              displayedData[displayedData.length - 1].id ===
              credits[credits.length - 1].id
            }
            type='button'
            onClick={handleNextClick}
          >
            Next 5
          </button>
        </div>
        <LineGraph data={displayedData} xAxisLabel='name' allowClick />
      </div>
      {/* Other Graphs */}
    </>
  );
};
export default Graphs;
