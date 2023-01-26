import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  ApiError,
  DetailedTv,
  TvShow as TvInterface,
} from '../../../interfaces';
import NoPoster from '../../NoPoster/NoPoster';
import Spinner from '../../Spinner/Spinner';
import Graphs from './Graphs/Graphs';
import fetchTvData from './fetchTvData';
import styles from './TvShow.module.css';

type TvData = TvInterface | DetailedTv | ApiError;

const TvShow = () => {
  const location = useLocation();
  const { tvId } = useParams();

  const [tvData, setTvData] = useState<TvData>(
    (location.state as TvInterface) || null
  );
  const [error, setError] = useState<Error>();

  useEffect(() => {
    (async (): Promise<void> => {
      window.scrollTo(0, 0);
      const data = await fetchTvData(tvId);
      setTvData(data);
    })().catch((err: Error) => setError(err));
  }, [tvId]);

  const renderWatchProviders = (): string => {
    const countryCode = Intl.DateTimeFormat()
      .resolvedOptions()
      .locale.slice(-2);

    if (tvData && 'watch/providers' in tvData) {
      const watchProviders = tvData['watch/providers'].results[countryCode];
      if (watchProviders?.flatrate)
        return `Stream on ${watchProviders.flatrate[0].provider_name}`;
    }

    return 'Unavailable to Stream';
  };

  const renderTvShow = (): JSX.Element => {
    if (error) return <p>{error.message}</p>;

    if (tvData === null)
      return (
        <div className={styles.loading}>
          <Spinner />
          <p>Getting Show Details</p>
        </div>
      );

    if ('status_message' in tvData) return <p>{tvData.status_message}</p>;

    const yearStart = tvData.first_air_date.slice(0, 4);
    const seasons = 'number_of_seasons' in tvData && tvData.number_of_seasons;
    return (
      <div className={styles.header}>
        {tvData.poster_path !== null ? (
          <img
            className={styles.poster}
            src={`https://image.tmdb.org/t/p/w300/${tvData.poster_path}`}
            alt=''
          />
        ) : (
          <NoPoster />
        )}
        <div className={styles.text}>
          <h2 className={styles.title}>
            {tvData.name}
            <span className={styles.released}> ({yearStart})</span>
          </h2>
          <div className={styles.info}>
            <span className={styles.genres}>
              {'genres' in tvData && tvData.genres.length
                ? tvData.genres.map((item, i) => `${i ? ', ' : ''}${item.name}`)
                : 'Unknown'}
            </span>
            <span>
              {' '}
              {seasons} {seasons === 1 ? 'Season' : 'Seasons'}{' '}
            </span>
            <span>{renderWatchProviders()}</span>
          </div>
          <p className={styles.overview}>{tvData.overview}</p>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div>{renderTvShow()}</div>
      {tvData && 'number_of_seasons' in tvData && <Graphs tvData={tvData} />}
    </div>
  );
};

export default TvShow;
