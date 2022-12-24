import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Movie, Person, TvShow } from '../../interfaces';
import Spinner from '../Spinner/Spinner';
import fetchSearchResults from './fetchSearchResults';
import styles from './SearchResults.module.css';

interface ApiResponse {
  // Success:
  page?: number;
  results?: (TvShow | Movie | Person)[];
  total_pages?: number;
  total_results?: number;

  // Error:
  status_message?: string;
  status_code?: number;
}

const SearchResults = () => {
  const { title } = useParams();

  const [results, setResults] = useState<ApiResponse>();
  const [error, setError] = useState<Error>();

  const renderSearchResults = (): JSX.Element => {
    if (error) return <p>{error.message}</p>;

    if (!results)
      return (
        <div className={styles.searching}>
          <Spinner />
          <p>Searching...</p>
        </div>
      );

    if (results.status_message) return <p>{results.status_message}</p>;

    // const totalPages = Math.ceil(
    //   parseInt(results.totalResults || '1', 10) / 10
    // );

    return (
      <>
        {results.results?.map((item) => {
          if ('profile_path' in item) {
            return (
              <Link
                to={`/actor/${item.id}`}
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
          }
          if ('title' in item) {
            return (
              <Link
                to={`/movie/${item.id}`}
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
              to={`/tvshow/${item.id}`}
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
        })}
        <div className={styles['page-selector']}>{/* Page Buttons */}</div>
      </>
    );
  };

  useEffect(() => {
    (async (): Promise<void> => {
      const data = await fetchSearchResults(title);
      setResults(data);
    })().catch((err: Error) => setError(err));
  }, [title]);

  return <div className={styles.results}>{renderSearchResults()}</div>;
};

export default SearchResults;
