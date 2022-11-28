import { TvShow, Movie } from '../../../interfaces';

interface PopularTV {
  // Success
  page?: 1;
  results?: TvShow[];
  total_results?: number;
  total_pages?: number;

  // Error
  status_message?: string;
  status_code?: number;
}

interface PopularMovie {
  // Success
  page?: 1;
  results?: Movie[];
  total_results?: number;
  total_pages?: number;

  // Error
  status_message?: string;
  status_code?: number;
}

const fetchPopular = async () => {
  const API_KEY: string = process.env.REACT_APP_API_KEY!;

  const tvResponse = await fetch(
    `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=1`
  );
  const tvData = (await tvResponse.json()) as PopularTV;

  const movieResponse = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
  );
  const movieData = (await movieResponse.json()) as PopularMovie;

  if (tvData.results && movieData.results) {
    const combinedPopular: (Movie | TvShow)[] = [
      ...tvData.results,
      ...movieData.results,
    ]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 10);
    return combinedPopular;
  }

  return tvData.status_message || movieData.status_message;
};

export default fetchPopular;
