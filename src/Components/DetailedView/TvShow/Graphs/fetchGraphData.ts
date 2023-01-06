import { ApiError } from '../../../../interfaces';

interface SeasonData {
  [seasonNumber: string]: {
    name: string;
    season_number: number;
    episodes: {
      episode_number: number;
      name: string;
      overview: string;
      vote_average: number;
      vote_count: number;
    }[];
  };
}

type Response = SeasonData | ApiError;

const fetchGraphData = async (tvId: number, seasons: number) => {
  const API_KEY: string = process.env.REACT_APP_API_KEY!;

  if (!tvId || !seasons)
    return { status_code: 0, status_message: 'Unable to fetch data' };

  let appendString = '';
  for (let i = 1; i <= seasons; i += 1) {
    appendString += `season/${i},`;
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${tvId}?api_key=${API_KEY}&append_to_response=${appendString}`
  );
  const seasonData = (await response.json()) as Response;
  if ('status_message' in seasonData) return seasonData;

  const allSeasons = [];
  for (let i = 1; i <= seasons; i += 1) {
    const concatSeason = 'season/'.concat(`${i}`);
    allSeasons.push(seasonData[`${concatSeason}`]);
  }

  return allSeasons;
};

export default fetchGraphData;
