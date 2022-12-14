import { ApiError, Movie, Person, TvShow } from '../../interfaces';

interface Results {
  page: number;
  results: (TvShow | Movie | Person)[];
  total_pages: number;
  total_results: number;
}

type SearchResults = Results | ApiError;

const fetchSearchResults = async (title: string | undefined) => {
  const API_KEY: string = process.env.REACT_APP_API_KEY!;

  if (!title) return { status_code: 0, status_message: 'No title found' };

  const response = await fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=en-US&query=${title}&page=1&include_adult=false`
  );
  const data = (await response.json()) as SearchResults;

  return data;
};

export default fetchSearchResults;
