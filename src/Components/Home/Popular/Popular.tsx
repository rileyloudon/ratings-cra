import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Movie, TvShow } from '../../../interfaces';
import fetchPopular from './fetchPopular';
import styles from './Popular.module.css';

type CurrentPopular = (TvShow | Movie)[] | string | undefined;

const Popular = () => {
  const [currentPopular, setCurrentPopular] = useState<CurrentPopular>();
  const [error, setError] = useState<Error>();

  const renderPopular = (): JSX.Element => {
    if (error) return <p>{error.message}</p>;

    // Error returned by TMDB
    if (typeof currentPopular === 'string') return <p>{currentPopular}</p>;

    return (
      <div className={styles['popular-posters']}>
        {currentPopular?.map((item) => {
          if ('name' in item)
            return (
              <Link
                to={`/tvshow/${item.id}`}
                key={item.id}
                state={item}
                className={styles['popular-item']}
              >
                {item.poster_path !== null ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200/${item.poster_path}`}
                    alt={`${item.name} Poster`}
                  />
                ) : (
                  <p className={styles['no-poster']}>No Poster</p>
                )}
              </Link>
            );

          return (
            <Link
              to={`/movie/${item.id}`}
              key={item.id}
              state={item}
              className={styles['popular-item']}
            >
              {item.poster_path !== null ? (
                <img
                  src={`https://image.tmdb.org/t/p/w200/${item.poster_path}`}
                  alt={`${item.title} Poster`}
                />
              ) : (
                <p className={styles['no-poster']}>No Poster</p>
              )}
            </Link>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    (async (): Promise<void> => {
      const res = await fetchPopular();
      setCurrentPopular(res);
    })().catch((err: Error) => setError(err));
  }, []);
  return (
    <>
      <p className={styles.popular}>Popular Now</p>
      {renderPopular()}
    </>
  );
};

export default Popular;
