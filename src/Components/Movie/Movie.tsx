import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ReactComponent as IMDbLogo } from '../../img/imdb-logo.svg';
import Spinner from '../Spinner/Spinner';
import styles from './Movie.module.css';

interface LocationMovie {
  Poster: string;
  Title: string;
  Type: string;
  Year: string;
  imdbID: string;
}

interface Results {
  Title?: string;
  Year?: string;
  Rated?: string;
  Released?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Plot?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Poster?: string;
  Ratings?: [{ Source: string; Value: string }];
  Metascore?: string;
  imdbRating?: string;
  imdbVotes?: string;
  imdbID?: string;
  Type?: string;
  totalSeasons?: string;
  Response: string;
  Error?: string;
}

const Movie = () => {
  const location = useLocation();
  const { title } = useParams();

  console.log(location.state);
  const basicMovieInfo = location.state as LocationMovie;

  const [detailedMovieInfo, setDetailedMovieInfo] = useState<Results>({
    Response: 'Loading',
  });

  useEffect(() => {
    (async (): Promise<void> => {
      const API_KEY: string = process.env.REACT_APP_API_KEY!;

      // Returns specific episode, remove &episode=1 to get full season
      // https://www.omdbapi.com/?apikey={API_KEY}&t=house+of+the+dragon&season=1&episode=1

      // http://www.omdbapi.com/?apikey=&t=Game%20of%20Thrones&Season=1&Episode=1

      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&t=${
          basicMovieInfo.Title || title || ''
        }`
      );
      const data = (await response.json()) as Results;

      console.log(data);
      setDetailedMovieInfo(data);
    })().catch((err: unknown) => {
      if (err instanceof Error)
        setDetailedMovieInfo({ Response: 'False', Error: err.message });
    });
  }, [basicMovieInfo.Title, title]);

  const renderMovie = (): JSX.Element => {
    if (detailedMovieInfo.Response === 'Loading' && !basicMovieInfo)
      return (
        <>
          <Spinner />
          <p>Searching</p>
        </>
      );

    if (detailedMovieInfo.Response === 'False')
      return <p>Error: {detailedMovieInfo.Error}</p>;

    // basicMovieInfo is data forwarded from clicking a search result.
    // It's missing some data though, so we also need to fetch detailedMovieInfo from OMDB api.

    return (
      <div>
        {detailedMovieInfo.Poster !== 'N/A' ||
        basicMovieInfo.Poster !== 'N/A' ? (
          <img src={detailedMovieInfo.Poster || basicMovieInfo.Poster} alt='' />
        ) : (
          <p className={styles['no-poster']}>No Poster</p>
        )}
        <p>{detailedMovieInfo.Title || basicMovieInfo.Title}</p>
        {detailedMovieInfo && (
          <>
            <p>
              <IMDbLogo />
              {detailedMovieInfo.imdbRating}
            </p>
            <p>{detailedMovieInfo.imdbVotes} Votes</p>
            <p>{detailedMovieInfo.Plot}</p>
          </>
        )}
        <a
          href={`https://www.imdb.com/title/${basicMovieInfo.imdbID}`}
          target='_blank'
          rel='noreferrer'
        >
          View on IMDB
        </a>
      </div>
    );
  };

  return <div>{renderMovie()}</div>;
};

export default Movie;
