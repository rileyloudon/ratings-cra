import { ApiError, DetailedTv } from '../../../interfaces';

type TvData = DetailedTv | ApiError;

const fetchTvData = async (tvId: string | undefined, signal: AbortSignal) => {
  const API_KEY: string = process.env.REACT_APP_API_KEY!;

  if (!tvId) return { status_code: 0, status_message: 'No tvID found' };

  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${tvId}?api_key=${API_KEY}&language=en-US&append_to_response=watch/providers,credits`,
    { signal }
  );
  const tvData = (await response.json()) as TvData;

  if ('status_message' in tvData) return tvData;

  const now = Date.now();
  const filteredSeasons = tvData.seasons.filter(
    (a) =>
      a.air_date !== null &&
      new Date(a.air_date).getTime() < now &&
      a.season_number > 0
  );

  return {
    ...tvData,
    seasons: filteredSeasons,
    number_of_seasons: filteredSeasons.length,
  };
};

export default fetchTvData;
