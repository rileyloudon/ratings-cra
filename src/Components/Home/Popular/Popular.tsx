import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  SearchResultMovie,
  SearchResultPerson,
  SearchResultTv,
} from '../../../interfaces';
import NoPoster from '../../NoPoster/NoPoster';
import fetchPopular from './fetchPopular';
import styles from './Popular.module.css';

type CurrentPopular =
  | (SearchResultTv | SearchResultMovie | SearchResultPerson)[]
  | string;

const Popular = () => {
  const [currentPopular, setCurrentPopular] = useState<CurrentPopular>();
  const [error, setError] = useState<Error>();

  const renderPopular = (): JSX.Element => {
    if (error) return <p>{error.message}</p>;

    // Error returned by TMDB
    if (typeof currentPopular === 'string') return <p>{currentPopular}</p>;

    return (
      <div className={styles.posters}>
        {/* use media_type to set variables */}
        {currentPopular?.map((item) => {
          const imgPath =
            'profile_path' in item ? item.profile_path : item.poster_path;
          const name = 'name' in item ? item.name : item.title;

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

  useEffect(() => {
    (async (): Promise<void> => {
      const res = await fetchPopular();
      setCurrentPopular(res);
    })().catch((err: Error) => setError(err));
  }, []);

  return currentPopular || error ? (
    <div className={styles.popular}>
      <p>Popular This Week</p>
      {renderPopular()}
    </div>
  ) : null;
};

export default Popular;
