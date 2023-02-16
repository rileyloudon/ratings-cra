import {
  ApiError,
  SearchResultTv,
  SearchResultMovie,
  SearchResultPerson,
} from '../../../interfaces';

interface Results {
  page: 1;
  results: (SearchResultTv | SearchResultMovie | SearchResultPerson)[];
  total_results: number;
  total_pages: number;
}

type Popular = Results | ApiError;

const fetchPopular = async (signal: AbortSignal) => {
  const API_KEY: string = process.env.REACT_APP_API_KEY!;

  const popular = await fetch(
    `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`,
    { signal }
  );
  const popularData = (await popular.json()) as Popular;
  if ('status_message' in popularData) return popularData;

  return popularData.results;
};

export default fetchPopular;
