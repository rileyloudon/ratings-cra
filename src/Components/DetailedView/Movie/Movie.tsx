import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ApiError, Movie as MovieInterface } from '../../../interfaces';
import Spinner from '../../Spinner/Spinner';
import fetchMovieData from './fetchMovieData';
import fetchWatchProviders from './fetchWatchProviders';
import styles from './Movie.module.css';

type MovieData = MovieInterface | ApiError;

interface StreamData {
  link: string;
  flatrate?: { logo_path: string; provider_name: string }[];
}

type WatchProviders = StreamData | string;

const Movie = () => {
  const location = useLocation();
  const { movieId } = useParams();

  const [movieData, setMovieData] = useState<MovieData | null>(
    (location.state as MovieInterface) || null
  );
  const [watchProviders, setWatchProviders] = useState<WatchProviders>('');
  const [error, setError] = useState<Error>();

  useEffect(() => {
    (async (): Promise<void> => {
      const data = await fetchMovieData(movieId);
      setMovieData(data);

      const streamData = await fetchWatchProviders(movieId);
      setWatchProviders(streamData);
    })().catch((err: Error) => setError(err));
  }, [movieId]);

  const renderWatchProviders = (): string => {
    // String will be an Error message
    if (typeof watchProviders === 'string') {
      return watchProviders;
    }

    if (watchProviders?.flatrate)
      return `Stream on ${watchProviders.flatrate[0].provider_name}`;

    return 'Unavailable to stream';
  };

  const renderMovie = (): JSX.Element => {
    if (error) return <p>{error.message}</p>;

    if (movieData === null)
      return (
        <>
          <Spinner />
          <p>Getting Movie Details</p>
        </>
      );

    if ('status_message' in movieData) return <p>{movieData.status_message}</p>;

    const yearReleased = movieData.release_date.slice(0, 4);
    const hours = movieData.runtime ? Math.trunc(movieData.runtime / 60) : 0;
    const minutes = movieData.runtime ? movieData.runtime % 60 : 0;
    const time = `${hours ? `${hours}h` : ''} ${minutes ? `${minutes}m` : ''}`;
    return (
      <>
        {movieData.poster_path !== null ? (
          <img
            src={`https://image.tmdb.org/t/p/w300/${movieData.poster_path}`}
            alt=''
          />
        ) : (
          <p className={styles['no-poster']}>No Poster</p>
        )}
        <h2>
          {movieData.title}
          <span>({yearReleased})</span>
        </h2>
        <div>
          <span>
            {movieData.genres?.map((item, i) => `${i ? ', ' : ''}${item.name}`)}
          </span>
          <span>{time}</span>
          <span>{renderWatchProviders()}</span>
        </div>
        <p>{movieData.overview}</p>
      </>
    );
  };

  // Movie graphs:
  // compared to collection
  return <div>{renderMovie()}</div>;
};

export default Movie;
