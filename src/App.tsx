import { useMemo, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Home/Home';
import SearchResults from './Components/SearchResults/SearchResults';
import Movie from './Components/Movie/Movie';
import Header from './Components/Header/Header';
import ThemeContext from './Context/ThemeContext';
import './App.css';

const App: React.FC = () => {
  // Dont build/use github pages -> use different hosting site then link in readme
  // Keep api key safe ^

  // pages:
  // Homepage with search in center
  // Search results page, move search to top. multiple pages of 10 results each
  // move/show page, keep search, add graphs for ratings, links to IMDB, view different seasons

  // const [movie, setMovie] = useState<unknown>();
  // const [error, setError] = useState<unknown>();

  const fallbackTheme = window.matchMedia('(prefers-color-scheme: dark)')
    .matches
    ? 'dark'
    : 'light';
  const [theme, setTheme] = useState<string>(
    localStorage.getItem('theme') || fallbackTheme
  );

  const changeTheme = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <div className='App' data-theme={theme}>
      <BrowserRouter>
        <ThemeContext.Provider value={changeTheme}>
          <Header />
          <Routes>
            <Route path='*' element={<Home />} />
            <Route path='search=:title' element={<SearchResults />} />
            <Route path='title/:title' element={<Movie />} />
          </Routes>
        </ThemeContext.Provider>
      </BrowserRouter>
    </div>
  );
};

export default App;
