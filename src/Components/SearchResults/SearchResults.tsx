import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import styles from './SearchResults.module.css';

interface Results {
  // TV SHOW
  page?: number;
  results?: [
    {
      backdrop_path: string;
      first_air_date: string;
      genre_ids: number[];
      id: number;
      media_type: string;
      name: string;
      origin_country: string[];
      original_language: string;
      original_name: string;
      overview: string;
      popularity: number;
      poster_path: string;
      vote_average: number;
      vote_count: number;
    }
  ];
  total_pages?: number;
  total_results?: number;

  // ERROR
  status_message?: string;
  status_code?: number;
}

const SearchResults = () => {
  const { title } = useParams();

  const [results, setResults] = useState<Results>({});

  const renderSearchResults = (): JSX.Element => {
    if (!results)
      return (
        <>
          <Spinner />
          <p>Searching...</p>
        </>
      );

    if (results.status_message) return <p>{results.status_message}</p>;

    // const totalPages = Math.ceil(
    //   parseInt(results.totalResults || '1', 10) / 10
    // );

    // tv shows use 'name', moveies use 'title'
    return (
      <>
        {results.results?.map((item) => (
          <Link
            // to={`/title/${item.name.toLowerCase()}`}
            to='/title'
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
        ))}
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
      const data = (await response.json()) as Results;

      console.log(data);
      setResults(data);
    })().catch((err: unknown) => {
      if (err instanceof Error) setResults({ status_message: err.message });
    });
  }, [title]);

  return <div className={styles.results}>{renderSearchResults()}</div>;
};

export default SearchResults;
