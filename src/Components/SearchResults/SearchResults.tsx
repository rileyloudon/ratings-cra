import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import styles from './SearchResults.module.css';

interface TvShow {
  poster_path: string | null;
  popularity: number;
  id: number;
  overview: string;
  backdrop_path: string | null;
  vote_average: number;
  media_type: 'tv';
  first_air_date: string;
  origin_country: string[];
  genre_ids: number[];
  original_language: string;
  vote_count: number;
  name: string;
  original_name: string;
}

interface Movie {
  poster_path: string | null;
  adult: boolean;
  overview: string;
  release_date: string;
  original_title: string;
  genre_ids: number[];
  id: number;
  media_type: 'movie';
  original_language: string;
  title: string;
  backdrop_path: string | null;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
}

interface Person {
  profile_path: string | null;
  adult: boolean;
  id: number;
  media_type: 'person';
  known_for: (TvShow | Movie)[];
  name: string;
  popularity: number;
}

interface Success {
  page: number;
  results: (TvShow | Movie | Person)[];
  total_pages: number;
  total_results: number;
}

// interface Fail {
//   status_message: string;
//   status_code: number;
// }

const SearchResults = () => {
  const { title } = useParams();

  const [results, setResults] = useState<Success>();
  // const [error, setError] = useState<Fail>();

  const renderSearchResults = (): JSX.Element => {
    if (!results)
      return (
        <>
          <Spinner />
          <p>Searching...</p>
        </>
      );

    // if (!results.page) return <p>{results.status_message}</p>;

    // const totalPages = Math.ceil(
    //   parseInt(results.totalResults || '1', 10) / 10
    // );

    // tv shows use 'name', moveies use 'title'
    return (
      <>
        {results.results?.map((item) => {
          if (item.media_type === 'tv') {
            return (
              <Link
                to={`/title/${item.name.toLowerCase()}`}
                key={item.id}
                state={item}
                className={styles['search-item']}
              >
                {item.poster_path !== null ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w300/${item.poster_path}`}
                    alt={`${item.name} Poster`}
                  />
                ) : (
                  <p className={styles['no-poster']}>No Poster</p>
                )}
                <p>{item.name}</p>
              </Link>
            );
          }
          if (item.media_type === 'movie') {
            return (
              <Link
                to={`/title/${item.title.toLowerCase()}`}
                key={item.id}
                state={item}
                className={styles['search-item']}
              >
                {item.poster_path !== null ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w300/${item.poster_path}`}
                    alt={`${item.title} Poster`}
                  />
                ) : (
                  <p className={styles['no-poster']}>No Poster</p>
                )}
                <p>{item.title}</p>
              </Link>
            );
          }
          return (
            <Link
              to={`/title/${item.name.toLowerCase()}`}
              key={item.id}
              state={item}
              className={styles['search-item']}
            >
              {item.profile_path !== null ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300/${item.profile_path}`}
                  alt={`${item.name} Poster`}
                />
              ) : (
                <p className={styles['no-poster']}>No Poster</p>
              )}
              <p>{item.name}</p>
            </Link>
          );
        })}
        <div className={styles['page-selector']}>{/* Page Buttons */}</div>
      </>
    );
  };

  useEffect(() => {
    (async (): Promise<void> => {
      const API_KEY: string = process.env.REACT_APP_API_KEY!;

      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=en-US&query=${
          title || ''
        }&page=1&include_adult=false`
      );
      const data = (await response.json()) as Success;

      console.log(data);
      setResults(data);
    })().catch((err: unknown) => {
      if (err instanceof Error) console.log(err);
    });
  }, [title]);

  return <div className={styles.results}>{renderSearchResults()}</div>;
};

export default SearchResults;
