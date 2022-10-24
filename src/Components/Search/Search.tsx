import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import styles from './Search.module.css';

const Search: React.FC = () => {
  const navigate = useNavigate();
  const [searchString, setSearchString] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    navigate(`/search=${searchString}`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type='search'
          id='search'
          placeholder='Search'
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
        <button type='submit'>Search</button>
      </form>
    </div>
  );
};

export default Search;
