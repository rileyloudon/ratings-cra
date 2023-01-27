import {
  ApiError,
  SearchResultMovie,
  SearchResultPerson,
  SearchResultTv,
} from '../../interfaces';

interface Results {
  page: number;
  results?: (SearchResultTv | SearchResultMovie | SearchResultPerson)[];
  total_pages: number;
  total_results: number;
}

type SearchResults = Results | ApiError;

const fetchSearchResults = async (
  title: string | undefined,
  pageNumber: string | undefined
) => {
  const API_KEY: string = process.env.REACT_APP_API_KEY!;

  if (!title) return { status_code: 0, status_message: 'No title found' };
  if (!pageNumber)
    return { status_code: 0, status_message: 'No page number found' };

  const response = await fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=en-US&query=${title}&page=${pageNumber}`
  );
  const data = (await response.json()) as SearchResults;

  return data;
};

export default fetchSearchResults;
