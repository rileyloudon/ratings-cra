import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Search from './Components/Search/Search';
import './App.css';
import SearchResults from './Components/SearchResults/SearchResults';

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
      <Search />
      <Routes>
        {/* Search results page */}
        <Route path='/search=:title' element={<SearchResults />} />
        {/* Specific film/tv show page */}
        {/* <Route path='title/*' element={} /> */}
      </Routes>
    </BrowserRouter>
  </div>
);
export default App;
