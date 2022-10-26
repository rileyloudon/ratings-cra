import { ReactComponent as SpinnerSvg } from '../../img/spinner.svg';
import styles from './Spinner.module.css';

const Spinner: React.FC = () => <SpinnerSvg className={styles.spinner} />;

export default Spinner;
