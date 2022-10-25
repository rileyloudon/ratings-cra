import Search from '../Search/Search';
import styles from './Home.module.css';

const Home = () => (
  <div className={styles.container}>
    <p>Search for Movies or TV Shows</p>
    <Search />
  </div>
);

export default Home;
