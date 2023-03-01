import { ReactComponent as TMDBLogo } from '../../img/tmdb.svg';
import { ReactComponent as JustWatchLogo } from '../../img/JustWatch.svg';
import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <p className={styles.disclaimer}>
      This product uses the TMDB API but is not endorsed or certified by TMDB.
    </p>
    <p className={styles.from}>
      Data from
      <a href='https://www.themoviedb.org/'>
        <TMDBLogo />
      </a>
      and
      <a href='https://www.justwatch.com/'>
        <JustWatchLogo />
      </a>
    </p>
  </footer>
);

export default Footer;
