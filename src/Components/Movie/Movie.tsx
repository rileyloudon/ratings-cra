import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ReactComponent as Spinner } from '../../img/spinner.svg';

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

const Movie: React.FC = () => {
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

      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${
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

    // Some items don't have a poster - need to add a default
    // Poster: "N/A"
    return (
      <div>
        <img src={detailedMovieInfo.Poster || basicMovieInfo.Poster} alt='' />
        <p>{detailedMovieInfo.Title || basicMovieInfo.Title}</p>
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
