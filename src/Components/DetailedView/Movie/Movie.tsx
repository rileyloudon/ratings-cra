import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  ApiError,
  Movie as MovieInterface,
  DetailedMovie,
} from '../../../interfaces';
import Graphs from './Graphs/Graphs';
import NoPoster from '../../NoPoster/NoPoster';
import Spinner from '../../Spinner/Spinner';
import fetchMovieData from './fetchMovieData';
import styles from './Movie.module.css';

type MovieData = DetailedMovie | MovieInterface | ApiError;

const Movie = () => {
  const location = useLocation();
  const { movieId } = useParams();

  const [movieData, setMovieData] = useState<MovieData>(
    (location.state as MovieInterface) || null
  );
  const [error, setError] = useState<Error>();

  useEffect(() => {
    (async (): Promise<void> => {
      window.scrollTo(0, 0);
      const data = await fetchMovieData(movieId);
      setMovieData(data);
    })().catch((err: Error) => setError(err));
  }, [movieId]);

  const renderWatchProviders = (): string => {
    if (movieData && 'watch/providers' in movieData) {
      const countryCode = Intl.DateTimeFormat()
        .resolvedOptions()
        .locale.slice(-2);

      const watchProviders = movieData['watch/providers'].results[countryCode];
      if (watchProviders?.flatrate)
        return `Stream on ${watchProviders.flatrate[0].provider_name}`;
    }

    return 'Unavailable to Stream';
  };

  const renderMovie = (): JSX.Element => {
    if (error) return <p>{error.message}</p>;

    if (movieData === null)
      return (
        <div className={styles.loading}>
          <Spinner />
          <p>Getting Movie Details</p>
        </div>
      );

    if ('status_message' in movieData) return <p>{movieData.status_message}</p>;

    const yearReleased = movieData.release_date.slice(0, 4);
    const hours =
      'runtime' in movieData ? Math.trunc(movieData.runtime / 60) : 0;
    const minutes = 'runtime' in movieData ? movieData.runtime % 60 : 0;
    const time =
      hours || minutes
        ? `${hours ? `${hours}h` : ''} ${minutes ? `${minutes}m` : ''}`
        : 'Unknown';
    return (
      <div className={styles.header}>
        {movieData.poster_path !== null ? (
          <img
            className={styles.poster}
            src={`https://image.tmdb.org/t/p/w300/${movieData.poster_path}`}
            alt=''
          />
        ) : (
          <NoPoster />
        )}
        <div className={styles.text}>
          <h2 className={styles.title}>
            {movieData.title}
            <span className={styles.released}> ({yearReleased})</span>
          </h2>
          <div className={styles.info}>
            <span className={styles.genres}>
              {'genres' in movieData && movieData.genres.length
                ? movieData.genres?.map(
                    (item, i) => `${i ? ', ' : ''}${item.name}`
                  )
                : 'Unknown'}
            </span>
            <span> {time} </span>
            <span>{renderWatchProviders()}</span>
          </div>
          <p className={styles.overview}>{movieData.overview}</p>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div>{renderMovie()}</div>
      {movieData && 'belongs_to_collection' in movieData && (
        <Graphs movieData={movieData} />
      )}
    </div>
  );
};

export default Movie;
