import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Home/Home';
import SearchResults from './Components/SearchResults/SearchResults';
import TvShow from './Components/DetailedView/TvShow/TvShow';
import Movie from './Components/DetailedView/Movie/Movie';
import Actor from './Components/DetailedView/Actor/Actor';
import Header from './Components/Header/Header';
import ThemeContext from './Context/ThemeContext';
import './App.css';

const App = () => {
  const fallbackTheme = window.matchMedia('(prefers-color-scheme: dark)')
    .matches
    ? 'dark'
    : 'light';
  const [theme, setTheme] = useState<string>(
    localStorage.getItem('theme') || fallbackTheme
  );
  const changeTheme = useMemo(() => ({ theme, setTheme }), [theme]);

  const [currentSearch, setCurrentSearch] = useState<string>('');
  const updateCurrentSearch = (value: string): void => setCurrentSearch(value);

  useEffect(() => {
    const doc = document.querySelector('html') as HTMLHtmlElement;
    doc.style.backgroundColor =
      theme === 'dark' ? 'rgb(30, 30, 30)' : 'rgb(255, 255, 255)';
  }, [theme]);

  return (
    <div className='App' data-theme={theme}>
      <BrowserRouter>
        <ThemeContext.Provider value={changeTheme}>
          <Header
            currentSearch={currentSearch}
            updateCurrentSearch={updateCurrentSearch}
          />
          <Routes>
            <Route
              path='*'
              element={<Home updateCurrentSearch={updateCurrentSearch} />}
            />
            <Route path='search=:title' element={<SearchResults />} />
            <Route path='tvshow/:tvId' element={<TvShow />} />
            <Route path='movie/:movieId' element={<Movie />} />
            <Route path='actor/:actorId' element={<Actor />} />
          </Routes>
        </ThemeContext.Provider>
      </BrowserRouter>
    </div>
  );
};

export default App;
