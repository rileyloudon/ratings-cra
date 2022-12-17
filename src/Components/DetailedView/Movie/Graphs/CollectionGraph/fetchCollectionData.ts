import { ApiError, Movie } from '../../../../../interfaces';

interface Collection {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  parts: Movie[];
}

type CollectionData = Collection | ApiError;

const fetchCollectionData = async (collectionId: number | undefined) => {
  const API_KEY: string = process.env.REACT_APP_API_KEY!;

  if (!collectionId)
    return { status_code: 0, status_message: 'No CollectionID found' };

  const response = await fetch(
    `https://api.themoviedb.org/3/collection/${collectionId}?api_key=${API_KEY}&language=en-US`
  );
  const collectionData = (await response.json()) as CollectionData;
  if ('status_message' in collectionData) return collectionData;

  const sortedParts: Movie[] = collectionData.parts.sort((a, b) =>
    a.release_date.localeCompare(b.release_date)
  );

  return { ...collectionData, parts: sortedParts };
};

export default fetchCollectionData;
