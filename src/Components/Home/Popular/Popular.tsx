import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Movie, TvShow } from '../../../interfaces';
import NoPoster from '../../NoPoster/NoPoster';
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
      <div className={styles.posters}>
        {currentPopular?.map((item) => {
          const p =
            'name' in item
              ? { link: 'tvshow', name: item.name }
              : { link: 'movie', name: item.title };

          return (
            <Link
              to={`/${p.link}/${item.id}`}
              key={item.id}
              state={item}
              className={styles.item}
            >
              {item.poster_path !== null ? (
                <img
                  src={`https://image.tmdb.org/t/p/w200/${item.poster_path}`}
                  alt={`${p.name} Poster`}
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

  useEffect(() => {
    (async (): Promise<void> => {
      const res = await fetchPopular();
      setCurrentPopular(res);
    })().catch((err: Error) => setError(err));
  }, []);

  return currentPopular || error ? (
    <div className={styles.popular}>
      <p>Popular Now</p>
      {renderPopular()}
    </div>
  ) : null;
};

export default Popular;
