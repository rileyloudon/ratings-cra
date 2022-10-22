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

  // OMDB seems to having problems with thier api, here's a copy of season 1 westworld
  const movieEpisodeData = {
    Title: 'Westworld',
    Season: '1',
    totalSeasons: '4',
    Episodes: [
      {
        Title: 'The Original',
        Released: '2016-10-02',
        Episode: '1',
        imdbRating: 'N/A',
        imdbID: 'tt4227538',
      },
      {
        Title: 'Chestnut',
        Released: '2016-10-09',
        Episode: '2',
        imdbRating: '8.5',
        imdbID: 'tt4562758',
      },
      {
        Title: 'The Stray',
        Released: '2016-10-16',
        Episode: '3',
        imdbRating: '8.2',
        imdbID: 'tt4625856',
      },
      {
        Title: 'Dissonance Theory',
        Released: '2016-10-23',
        Episode: '4',
        imdbRating: '8.6',
        imdbID: 'tt4625862',
      },
      {
        Title: 'Contrapasso',
        Released: '2016-10-30',
        Episode: '5',
        imdbRating: '8.6',
        imdbID: 'tt4625866',
      },
      {
        Title: 'The Adversary',
        Released: '2016-11-06',
        Episode: '6',
        imdbRating: '8.8',
        imdbID: 'tt4630544',
      },
      {
        Title: "Trompe L'Oeil",
        Released: '2016-11-13',
        Episode: '7',
        imdbRating: '9.4',
        imdbID: 'tt4630546',
      },
      {
        Title: 'Trace Decay',
        Released: '2016-11-20',
        Episode: '8',
        imdbRating: '8.7',
        imdbID: 'tt4458814',
      },
      {
        Title: 'The Well-Tempered Clavier',
        Released: '2016-11-27',
        Episode: '9',
        imdbRating: '9.3',
        imdbID: 'tt5220026',
      },
      {
        Title: 'The Bicameral Mind',
        Released: '2016-12-04',
        Episode: '10',
        imdbRating: '9.7',
        imdbID: 'tt5229638',
      },
    ],
    Response: 'True',
  };

  console.log(movieEpisodeData);

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
