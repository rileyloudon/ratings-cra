import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ApiError, Person, DetailedPerson } from '../../../interfaces';
import Graphs from './Graphs/Graphs';
import NoPoster from '../../NoPoster/NoPoster';
import Spinner from '../../Spinner/Spinner';
import fetchActorData from './fetchActorData';
import styles from './Actor.module.css';

type ActorData = Person | DetailedPerson | ApiError;

const Actor = () => {
  const location = useLocation();
  const { actorId } = useParams();

  const [actorData, setActorData] = useState<ActorData>(
    (location.state as Person) || null
  );
  const [showMoreBio, setShowMoreBio] = useState<boolean>(false);
  const [error, setError] = useState<Error | false>(false);

  useEffect(() => {
    const abortController = new AbortController();

    (async (): Promise<void> => {
      window.scrollTo(0, 0);
      const data = await fetchActorData(actorId, abortController.signal);
      setError(false);
      setActorData(data);
    })().catch((err: Error) => setError(err));
    return () => abortController.abort();
  }, [actorId]);

  const getAge = () => {
    if ('birthday' in actorData) {
      const ageDiff = Date.now() - new Date(actorData.birthday).getTime();
      const date = new Date(ageDiff);
      return <span>{Math.abs(date.getUTCFullYear() - 1970)} Years Old</span>;
    }
    return null;
  };

  const getBio = () => {
    if ('biography' in actorData) {
      return (
        <div className={styles.bio}>
          {actorData.biography.length > 1250 ? (
            <>
              <p>
                {showMoreBio
                  ? actorData.biography
                  : `${actorData.biography.substring(0, 1250)}...`}
              </p>
              <button
                type='button'
                onClick={() => setShowMoreBio(!showMoreBio)}
              >
                {showMoreBio ? 'Read Less' : 'Read More'}
              </button>
            </>
          ) : (
            <p>{actorData.biography}</p>
          )}
        </div>
      );
    }
    return null;
  };

  const renderActor = (): JSX.Element => {
    if (error) return <p className={styles.error}>{error.message}</p>;

    if (actorData === null)
      return (
        <div className={styles.loading}>
          <Spinner />
          <p>Getting Actor Details</p>
        </div>
      );

    if ('status_message' in actorData)
      return <p className={styles.error}>{actorData.status_message}</p>;

    return (
      <div className={styles.header}>
        {actorData.profile_path !== null ? (
          <img
            className={styles.poster}
            src={`https://image.tmdb.org/t/p/w500/${actorData.profile_path}`}
            alt=''
          />
        ) : (
          <NoPoster />
        )}
        <div className={styles.text}>
          <h2 className={styles.name}>{actorData.name}</h2>
          <div className={styles.info}>
            {getAge()}
            {'combined_credits' in actorData && (
              <span>{actorData.combined_credits.cast.length} Credits</span>
            )}
          </div>
          {getBio()}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderActor()}
      {actorData &&
        'combined_credits' in actorData &&
        actorData.combined_credits.cast.length && (
          <Graphs credits={actorData.combined_credits.cast} />
        )}
    </>
  );
};

export default Actor;
