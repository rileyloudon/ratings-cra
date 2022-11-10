import Search from '../Search/Search';
import styles from './Home.module.css';

interface HomeProps {
  updateCurrentSearch(value: string): void;
}

const Home = ({ updateCurrentSearch }: HomeProps) => (
  <div className={styles.container}>
    <p>Search for Movies or TV Shows</p>
    <Search updateCurrentSearch={updateCurrentSearch} />
  </div>
);

export default Home;
