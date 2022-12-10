import Search from '../Search/Search';
import Popular from './Popular/Popular';
import styles from './Home.module.css';

interface HomeProps {
  updateCurrentSearch(value: string): void;
}

const Home = ({ updateCurrentSearch }: HomeProps) => (
  <div className={styles.container}>
    <p className={styles.instructions}>Search for Movies or TV Shows</p>
    <Search updateCurrentSearch={updateCurrentSearch} />
    <Popular />
  </div>
);

export default Home;
