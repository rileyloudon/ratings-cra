import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeContext from '../../Context/ThemeContext';
import { ReactComponent as LightSvg } from '../../img/light-mode.svg';
import { ReactComponent as DarkSvg } from '../../img/dark-mode.svg';
import Search from '../Search/Search';
import styles from './Header.module.css';

interface HeaderProps {
  currentSearch: string;
  updateCurrentSearch(value: string): void;
}

const Header: React.FC<HeaderProps> = ({
  currentSearch,
  updateCurrentSearch,
}) => {
  const location = useLocation();

  const currentTheme = useContext(ThemeContext);

  const handleTheme = () => {
    const newTheme = currentTheme?.theme === 'light' ? 'dark' : 'light';
    currentTheme?.setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const displaySearch =
    /\/search=[A-Za-z0-9]+/i.test(location.pathname) ||
    /\/title\/[A-Za-z0-9]+/i.test(location.pathname);

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
      <div className={styles['button-container']}>
        <button type='button' className={styles.button} onClick={handleTheme}>
          {currentTheme?.theme === 'light' ? <DarkSvg /> : <LightSvg />}
          Toggle Theme
        </button>
      </div>
    </header>
  );
};

export default Header;
