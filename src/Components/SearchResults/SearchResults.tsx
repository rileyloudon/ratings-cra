import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ApiError,
  SearchResultMovie,
  SearchResultPerson,
  SearchResultTv,
} from '../../interfaces';
import NoPoster from '../NoPoster/NoPoster';
import Spinner from '../Spinner/Spinner';
import fetchSearchResults from './fetchSearchResults';
import styles from './SearchResults.module.css';

interface Results {
  page: number;
  results?: (SearchResultTv | SearchResultMovie | SearchResultPerson)[];
  total_pages: number;
  total_results: number;
}

type ApiResponse = Results | ApiError;

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

    if ('status_message' in results) return <p>{results.status_message}</p>;

    // const totalPages = Math.ceil(
    //   parseInt(results.totalResults || '1', 10) / 10
    // );

    if (!results.results?.length)
      return <p className={styles['no-results']}>No results found</p>;

    return (
      <>
        {results.results?.map((item) => {
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
              <p>{name}</p>
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
