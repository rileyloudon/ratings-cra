import { Movie, Person, TvShow } from '../../interfaces';

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

const fetchSearchResults = async (title: string | undefined) => {
  const API_KEY: string = process.env.REACT_APP_API_KEY!;

  const response = await fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=en-US&query=${
      title || ''
    }&page=1&include_adult=false`
  );
  const data = (await response.json()) as ApiResponse;

  return data;
};

export default fetchSearchResults;
