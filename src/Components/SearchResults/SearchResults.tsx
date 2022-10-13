import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ReactComponent as Spinner } from '../../img/spinner.svg';

interface Results {
  Response: string;
  Search?: [
    {
      Poster: string;
      Title: string;
      type: string;
      year: string;
      imdbID: string;
    }
  ];
  totalReslts?: string;
  Error?: string;
}

const SearchResults: React.FC = () => {
  const { title } = useParams();
  const [results, setResults] = useState<Results>({
    Response: 'Loading',
  });

  const renderSearchResults = (): JSX.Element => {
    if (results.Response === 'Loading')
      return (
        <>
          <Spinner />
          <p>Searching</p>
        </>
      );

    if (results.Response === 'False') return <p>Error: {results.Error}</p>;

    // Some items don't have a poster - need to add a default
    // Poster: "N/A"
    return (
      <div>
        {results.Search?.map((item) => (
          <Link
            to={`/title/${item.Title.toLowerCase()}`}
            key={item.imdbID}
            state={item}
          >
            <img src={item.Poster} alt={`${item.Title} Poster`} />
            <p>{item.Title}</p>
          </Link>
        ))}
      </div>
    );
  };

  useEffect(() => {
    (async (): Promise<void> => {
      const API_KEY: string = process.env.REACT_APP_API_KEY!;

      // Returns specific episode, remove &episode=1 to get full season
      // https://www.omdbapi.com/?apikey={API_KEY}&t=house+of+the+dragon&season=1&episode=1

      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${title || ''}&page=1`
      );
      const data = (await response.json()) as Results;

      console.log(data);
      setResults(data);
    })().catch((err: unknown) => {
      if (err instanceof Error)
        setResults({ Response: 'False', Error: err.message });
    });
  }, [title]);

  return <div>{renderSearchResults()}</div>;
};

export default SearchResults;
