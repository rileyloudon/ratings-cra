import { ApiError, Movie } from '../../../../interfaces';
import CollectionGraph from './CollectionGraph/CollectionGraph';

interface GraphsProps {
  movieData: Movie | ApiError;
}

const Graphs = ({ movieData }: GraphsProps) => (
  <>
    {'belongs_to_collection' in movieData &&
      movieData.belongs_to_collection !== null && (
        <CollectionGraph CollectionId={movieData.belongs_to_collection?.id} />
      )}
    {/* Other Graphs */}
  </>
);
export default Graphs;
