import { ApiError, DetailedPerson } from '../../../interfaces';

type ActorData = DetailedPerson | ApiError;

const fetchActorData = async (actorId: string | undefined) => {
  const API_KEY: string = process.env.REACT_APP_API_KEY!;

  if (!actorId) return { status_code: 0, status_message: 'No actorID found' };

  const response = await fetch(
    `https://api.themoviedb.org/3/person/${actorId}?api_key=${API_KEY}&language=en-US&append_to_response=combined_credits`
  );
  const actorData = (await response.json()) as ActorData;

  if ('status_message' in actorData) return actorData;

  const creditsByPopularity = actorData.combined_credits.cast.sort(
    (a, b) => b.popularity - a.popularity
  );

  return { ...actorData, combined_credits: creditsByPopularity };
};

export default fetchActorData;
