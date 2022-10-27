import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Home/Home';
import SearchResults from './Components/SearchResults/SearchResults';
import Movie from './Components/Movie/Movie';
import Header from './Components/Header/Header';
import './App.css';

const App: React.FC = () => (
  // Dont build/use github pages -> use different hosting site then link in readme
  // Keep api key safe ^

  // pages:
  // Homepage with search in center
  // Search results page, move search to top. multiple pages of 10 results each
  // move/show page, keep search, add graphs for ratings, links to IMDB, view different seasons

  // const [movie, setMovie] = useState<unknown>();
  // const [error, setError] = useState<unknown>();

  <div className='App'>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='*' element={<Home />} />
        <Route path='search=:title' element={<SearchResults />} />
        <Route path='title/:title' element={<Movie />} />
      </Routes>
    </BrowserRouter>
  </div>
);
export default App;
