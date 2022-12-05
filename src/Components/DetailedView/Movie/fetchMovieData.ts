import { ApiError, Movie } from '../../../interfaces';

type MovieData = Movie | ApiError;

const fetchMovieData = async (movieId: string | undefined) => {
  const API_KEY: string = process.env.REACT_APP_API_KEY!;

  if (!movieId) return { status_code: 0, status_message: 'No movieId found' };

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`
  );
  const movieData = (await response.json()) as MovieData;

  return movieData;
};

export default fetchMovieData;
