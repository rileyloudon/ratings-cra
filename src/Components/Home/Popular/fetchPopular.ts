import { TvShow, Movie, ApiError } from '../../../interfaces';

interface TvResults {
  page: 1;
  results: TvShow[];
  total_results: number;
  total_pages: number;
}

type PopularTV = TvResults | ApiError;

interface MovieResults {
  page: 1;
  results: Movie[];
  total_results: number;
  total_pages: number;
}

type PopularMovie = MovieResults | ApiError;

const fetchPopular = async () => {
  const API_KEY: string = process.env.REACT_APP_API_KEY!;
  const countryCode = Intl.DateTimeFormat().resolvedOptions().locale.slice(-2);

  const tvResponse = await fetch(
    `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=1&region=${countryCode}`
  );
  const tvData = (await tvResponse.json()) as PopularTV;
  if ('status_message' in tvData) return tvData.status_message;

  const movieResponse = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1&region=${countryCode}`
  );
  const movieData = (await movieResponse.json()) as PopularMovie;
  if ('status_message' in movieData) return movieData.status_message;

  const combinedPopular: (Movie | TvShow)[] = [
    ...tvData.results,
    ...movieData.results,
  ]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10);
  return combinedPopular;
};

export default fetchPopular;
