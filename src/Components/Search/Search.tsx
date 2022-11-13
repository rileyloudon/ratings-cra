import { FocusEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Search.module.css';

interface SearchProps {
  currentSearch?: string;
  updateCurrentSearch(value: string): void;
}

const Search = ({ currentSearch = '', updateCurrentSearch }: SearchProps) => {
  const navigate = useNavigate();

  const [searchString, setSearchString] = useState<string>(currentSearch);

  const handleFocus = (e: FocusEvent<HTMLInputElement>): void =>
    e.target.select();

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (searchString.length >= 1) {
      updateCurrentSearch(searchString);
      navigate(`/search=${searchString}`);
    }
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type='search'
          placeholder='Search'
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          onFocus={handleFocus}
          // fixes safari handleFocus not selecting
          onMouseUp={(e) => e.preventDefault()}
        />
        <button type='submit'>Search</button>
      </form>
    </div>
  );
};

export default Search;
