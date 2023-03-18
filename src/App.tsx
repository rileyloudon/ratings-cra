import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Home/Home';
import SearchResults from './Components/SearchResults/SearchResults';
import TvShow from './Components/DetailedView/TvShow/TvShow';
import Movie from './Components/DetailedView/Movie/Movie';
import Actor from './Components/DetailedView/Actor/Actor';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import styles from './App.module.css';

const App = () => {
  const [currentSearch, setCurrentSearch] = useState<string>('');
  const updateCurrentSearch = (value: string): void => setCurrentSearch(value);

  useEffect(() => {
    const doc = document.querySelector('html') as HTMLHtmlElement;
    doc.style.backgroundColor = 'rgb(22, 22, 22)';
  }, []);

  return (
    <div className={styles.app}>
      <BrowserRouter>
        <Header
          currentSearch={currentSearch}
          updateCurrentSearch={updateCurrentSearch}
        />
        <div className={styles.content}>
          <Routes>
            <Route
              path='*'
              element={<Home updateCurrentSearch={updateCurrentSearch} />}
            />
            <Route
              path='search=:title/:pageNumber'
              element={<SearchResults />}
            />
            <Route path='tvshow/:tvId' element={<TvShow />} />
            <Route path='movie/:movieId' element={<Movie />} />
            <Route path='actor/:actorId' element={<Actor />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
