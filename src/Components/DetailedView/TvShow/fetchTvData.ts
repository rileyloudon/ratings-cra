import { ApiError, DetailedTv } from '../../../interfaces';

type TvData = DetailedTv | ApiError;

const fetchTvData = async (tvId: string | undefined) => {
  const API_KEY: string = process.env.REACT_APP_API_KEY!;

  if (!tvId) return { status_code: 0, status_message: 'No tvID found' };

  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${tvId}?api_key=${API_KEY}&language=en-US&append_to_response=watch/providers`
  );
  const tvData = (await response.json()) as TvData;

  return tvData;
};

export default fetchTvData;
