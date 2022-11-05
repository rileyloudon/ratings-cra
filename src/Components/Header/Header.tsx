import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeContext from '../../Context/ThemeContext';
import { ReactComponent as LightSvg } from '../../img/light-mode.svg';
import { ReactComponent as DarkSvg } from '../../img/dark-mode.svg';

import Search from '../Search/Search';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const location = useLocation();
  console.log(location);

  const currentTheme = useContext(ThemeContext);

  const handleTheme = () => {
    const newTheme = currentTheme?.theme === 'light' ? 'dark' : 'light';
    currentTheme?.setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <header className={styles.container}>
      <h2 className={styles.title}>
        <Link to='/'>Ratings</Link>
      </h2>
      {location.pathname !== '/' && <Search />}
      <button type='button' className={styles.button} onClick={handleTheme}>
        {currentTheme?.theme === 'light' ? <LightSvg /> : <DarkSvg />}
        Toggle Theme
      </button>
    </header>
  );
};

export default Header;
