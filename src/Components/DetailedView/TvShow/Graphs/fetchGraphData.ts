import { Season, ApiError } from '../../../../interfaces';

type SeasonData = Season | ApiError;

const fetchGraphData = async (
  tvId: number,
  seasons: number,
  signal: AbortSignal
) => {
  const API_KEY: string = process.env.REACT_APP_API_KEY!;

  if (!tvId || !seasons)
    return { status_code: 0, status_message: 'Unable to fetch data' };

  // append_to_response has a limit of 20 sub requests
  // need to split fetch into groups of 20 or less.
  let appendString = '';
  const appendStringArray = [];
  for (let i = 1; i <= seasons; i += 1) {
    appendString += `season/${i},`;
    if (i % 20 === 0 || i === seasons) {
      appendStringArray.push(appendString);
      appendString = '';
    }
  }

  const promises = [];
  for (let i = 0; i < appendStringArray.length; i += 1) {
    promises.push(
      fetch(
        `https://api.themoviedb.org/3/tv/${tvId}?api_key=${API_KEY}&append_to_response=${appendStringArray[i]}`,
        { signal }
      )
    );
  }

  const res = await Promise.all(promises);
  const data = (await Promise.all(res.map((r) => r.json()))) as SeasonData[];

  const combinedData = Object.assign({}, ...data) as SeasonData;

  if ('status_message' in combinedData) return combinedData;

  const allSeasons: Season = {};
  Object.keys(combinedData).forEach((key) => {
    if (key.includes('season/')) allSeasons[key] = combinedData[key];
  });

  return allSeasons;
};

export default fetchGraphData;
