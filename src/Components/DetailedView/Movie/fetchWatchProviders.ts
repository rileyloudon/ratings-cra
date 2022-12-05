import { ApiError } from '../../../interfaces';

interface Streams {
  id: number;
  results: {
    [countryCode: string]: {
      link: string;
      flatrate?: { logo_path: string; provider_name: string }[];
    };
  };
}

type WatchProviders = Streams | ApiError;

const fetchWatchProviders = async (movieId: string | undefined) => {
  const API_KEY: string = process.env.REACT_APP_API_KEY!;

  if (!movieId) return 'No movieID found';

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`
  );
  const watchProviders = (await response.json()) as WatchProviders;

  const countryCode = Intl.DateTimeFormat().resolvedOptions().locale.slice(-2);

  if ('results' in watchProviders) return watchProviders.results[countryCode];
  return 'Error fetching streams';
};

export default fetchWatchProviders;
