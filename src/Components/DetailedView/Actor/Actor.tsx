import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApiError, Person, DetailedPerson } from '../../../interfaces';
import Graphs from './Graphs/Graphs';
import NoPoster from '../../NoPoster/NoPoster';
import Spinner from '../../Spinner/Spinner';
import fetchActorData from './fetchActorData';
import styles from './Actor.module.css';

type ActorData = Person | DetailedPerson | ApiError;

const Actor = () => {
  const { actorId } = useParams();

  const [actorData, setActorData] = useState<ActorData | null>(null);
  const [textHeight, setTextHeight] = useState<number>(0);
  const [showMoreBio, setShowMoreBio] = useState<boolean>(false);
  const [error, setError] = useState<Error | false>(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleElementResize = () => {
    if (ref.current && ref.current.scrollHeight !== textHeight)
      setTextHeight(ref.current?.offsetHeight);
  };

  const resizeObserver = new ResizeObserver(handleElementResize);

  useLayoutEffect(() => {
    if (ref.current) resizeObserver.observe(ref.current);
    return () => resizeObserver.disconnect();
  });

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
    if (actorData && 'birthday' in actorData) {
      const ageDiff = Date.now() - new Date(actorData.birthday).getTime();
      const date = new Date(ageDiff);
      return <span>{Math.abs(date.getUTCFullYear() - 1970)} Years Old</span>;
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
        {'biography' in actorData && (
          <div
            ref={ref}
            className={`${styles.text} ${
              textHeight >= 450 && !showMoreBio
                ? styles['hidden-bio']
                : styles['long-bio']
            }`}
          >
            <h2 className={styles.name}>{actorData.name}</h2>
            <div className={styles.info}>
              {getAge()}
              <span>{actorData.combined_credits.cast.length} Credits</span>
            </div>
            <p className={styles.bio}>{actorData.biography}</p>
          </div>
        )}
        {textHeight >= 450 && (
          <button type='button' onClick={() => setShowMoreBio(!showMoreBio)}>
            {showMoreBio ? 'Read Less' : 'Read More'}
          </button>
        )}
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
