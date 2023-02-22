import { Link } from 'react-router-dom';
import { Credit } from '../../../interfaces';
import styles from './CastCard.module.css';

const CastCard = ({ cast }: { cast: Credit[] }) => (
  <div className={styles.castCards}>
    {cast.map((person) =>
      person.profile_path !== null ? (
        <Link
          to={`/actor/${person.id}`}
          key={person.id}
          className={styles.card}
        >
          <img
            src={`https://image.tmdb.org/t/p/w185/${person.profile_path}`}
            alt={`${person.name} Poster`}
          />
          <p className={styles.name}>{person.name}</p>
          <p className={styles.character}>{person.character}</p>
        </Link>
      ) : null
    )}
  </div>
);

export default CastCard;
