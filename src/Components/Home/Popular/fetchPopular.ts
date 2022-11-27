import { TvShow, Movie } from '../../../interfaces';

interface PopularTV {
  page: 1;
  results: TvShow[];
  total_results: number;
  total_pages: number;
}

interface PopularMovie {
  page: 1;
  results: Movie[];
  total_results: number;
  total_pages: number;
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

  const combinedPopular: (Movie | TvShow)[] = [
    ...tvData.results,
    ...movieData.results,
  ]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10);

  return combinedPopular;
};

export default fetchPopular;
