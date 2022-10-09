import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
    Response: 'False',
    Error: 'Please enter a search string',
  });

  const renderSearchResults = (): JSX.Element => {
    if (results.Response === 'False') {
      return <p>Error: {results.Error}</p>;
    }

    // Some items don't have a poster - need to add a default
    // Poster: "N/A"
    return (
      <div>
        {results.Search?.map((item) => (
          <div key={item.imdbID}>
            <img src={item.Poster} alt={`${item.Title} Poster`} />
            <p>{item.Title}</p>
          </div>
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
    })().catch((err) => {
      if (typeof err === 'string')
        setResults({ Response: 'False', Error: err });
    });
  }, [title]);

  return <div>{renderSearchResults()}</div>;
};

export default SearchResults;
