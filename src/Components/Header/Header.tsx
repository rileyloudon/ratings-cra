import { Link, useLocation } from 'react-router-dom';
import Search from '../Search/Search';
import styles from './Header.module.css';

interface HeaderProps {
  currentSearch: string;
  updateCurrentSearch(value: string): void;
}

const Header = ({ currentSearch, updateCurrentSearch }: HeaderProps) => {
  const location = useLocation();

  const displaySearch =
    /\/search=[A-Za-z0-9]+/i.test(location.pathname) ||
    /\/tvshow\/[0-9]+/i.test(location.pathname) ||
    /\/movie\/[0-9]+/i.test(location.pathname) ||
    /\/actor\/[0-9]+/i.test(location.pathname);

  return (
    <header className={styles.container}>
      <h2 className={styles.title}>
        <Link to='/'>Ratings</Link>
      </h2>
      {displaySearch && (
        <Search
          currentSearch={currentSearch}
          updateCurrentSearch={updateCurrentSearch}
        />
      )}
    </header>
  );
};

export default Header;
