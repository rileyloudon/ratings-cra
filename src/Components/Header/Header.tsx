import { Link, useLocation } from 'react-router-dom';
import Search from '../Search/Search';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className={styles.container}>
      <h2 className={styles.title}>
        <Link to='/'>Ratings</Link>
      </h2>
      {location.pathname !== '/' && <Search />}
      <button type='button' className={styles.button}>
        Toggle Theme
      </button>
    </header>
  );
};

export default Header;
