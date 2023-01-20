import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ApiError, Person, DetailedPerson } from '../../../interfaces';
// import Graphs from './Graphs/Graphs';
import NoPoster from '../../NoPoster/NoPoster';
import Spinner from '../../Spinner/Spinner';
import fetchActorData from './fetchActorData';
import styles from './Actor.module.css';

type ActorData = Person | DetailedPerson | ApiError;

const Movie = () => {
  const location = useLocation();
  const { actorId } = useParams();

  const [actorData, setActorData] = useState<ActorData>(
    (location.state as Person) || null
  );
  const [error, setError] = useState<Error>();

  useEffect(() => {
    (async (): Promise<void> => {
      window.scrollTo(0, 0);
      const data = await fetchActorData(actorId);
      console.log(data);

      setActorData(data);
    })().catch((err: Error) => setError(err));
  }, [actorId]);

  const getAge = () => {
    if ('birthday' in actorData) {
      const ageDiff = Date.now() - new Date(actorData.birthday).getTime();
      const date = new Date(ageDiff);
      return `${Math.abs(date.getUTCFullYear() - 1970)} Years Old`;
    }
    return null;
  };

  const renderActor = (): JSX.Element => {
    if (error) return <p>{error.message}</p>;

    if (actorData === null)
      return (
        <>
          <Spinner />
          <p>Getting Actor Details</p>
        </>
      );

    if ('status_message' in actorData) return <p>{actorData.status_message}</p>;

    return (
      <div className={styles.header}>
        {actorData.profile_path !== null ? (
          <img
            className={styles.poster}
            src={`https://image.tmdb.org/t/p/w300/${actorData.profile_path}`}
            alt=''
          />
        ) : (
          <NoPoster />
        )}
        <div className={styles.text}>
          <h2 className={styles.title}>{actorData.name}</h2>
          <div className={styles.info}>
            <span>{getAge()}</span>
            {'combined_credits' in actorData && (
              <span>{actorData.combined_credits.cast.length} Credits</span>
            )}
          </div>
          {'biography' in actorData && (
            <p className={styles.bio}>{actorData.biography}</p>
          )}
        </div>
      </div>
    );
  };

  // Graphs:
  // -display top 5 (?) credits, have an option to view next/previous 5

  return (
    <div className={styles.container}>
      <div>{renderActor()}</div>
      {/* {actorData && 'belongs_to_collection' in actorData && (
        <Graphs actorData={actorData} />
      )} */}
    </div>
  );
};

export default Movie;
