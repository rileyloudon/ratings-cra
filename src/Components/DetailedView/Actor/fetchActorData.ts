import { ApiError, DetailedPerson } from '../../../interfaces';

type ActorData = DetailedPerson | ApiError;

const fetchActorData = async (
  actorId: string | undefined,
  signal: AbortSignal
) => {
  const API_KEY: string = process.env.REACT_APP_API_KEY!;

  if (!actorId) return { status_code: 0, status_message: 'No actorID found' };

  const response = await fetch(
    `https://api.themoviedb.org/3/person/${actorId}?api_key=${API_KEY}&language=en-US&append_to_response=combined_credits`,
    { signal }
  );
  const actorData = (await response.json()) as ActorData;

  if ('status_message' in actorData) return actorData;

  const ids = actorData.combined_credits.cast.map((credit) => credit.id);
  const creditsByPopularity = actorData.combined_credits.cast
    .filter((credit, i) => !ids.includes(credit.id, i + 1))
    .map((credit) => ({
      ...credit,
      name: 'name' in credit ? credit.name : credit.title,
    }))
    .sort((a, b) => b.popularity - a.popularity);

  return { ...actorData, combined_credits: { cast: creditsByPopularity } };
};

export default fetchActorData;
