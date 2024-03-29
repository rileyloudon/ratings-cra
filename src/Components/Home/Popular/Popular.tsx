import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ApiError,
  SearchResultMovie,
  SearchResultPerson,
  SearchResultTv,
} from '../../../interfaces';
import NoPoster from '../../NoPoster/NoPoster';
import fetchPopular from './fetchPopular';
import styles from './Popular.module.css';

type CurrentPopular =
  | (SearchResultTv | SearchResultMovie | SearchResultPerson)[]
  | ApiError;

const Popular = () => {
  const [currentPopular, setCurrentPopular] = useState<CurrentPopular>();
  const [error, setError] = useState<Error | false>(false);

  useEffect(() => {
    const abortController = new AbortController();

    (async (): Promise<void> => {
      const res = await fetchPopular(abortController.signal);
      setError(false);
      setCurrentPopular(res);
    })().catch((err: Error) => setError(err));
    return () => abortController.abort();
  }, []);

  const renderPopular = (): JSX.Element => {
    if (error) return <p className={styles.error}>{error.message}</p>;

    if (currentPopular && 'status_message' in currentPopular)
      return <p className={styles.error}>{currentPopular.status_message}</p>;

    return (
      <div className={styles.posters}>
        {currentPopular?.map((item) => {
          const imgPath =
            item.media_type === 'person' ? item.profile_path : item.poster_path;
          const name = item.media_type === 'movie' ? item.title : item.name;

          let link = 'movie';
          if (item.media_type === 'tv') link = 'tvshow';
          else if (item.media_type === 'person') link = 'actor';

          return (
            <Link
              to={`/${link}/${item.id}`}
              key={item.id}
              state={item}
              className={styles.item}
            >
              {imgPath !== null ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300/${imgPath}`}
                  alt={`${name} Poster`}
                />
              ) : (
                <NoPoster />
              )}
            </Link>
          );
        })}
      </div>
    );
  };

  return currentPopular || error ? (
    <div className={styles.popular}>
      <p>Popular This Week</p>
      {renderPopular()}
    </div>
  ) : null;
};

export default Popular;
