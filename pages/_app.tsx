import { ReactNode } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Header from '../src/Components/Header/Header';
import Footer from '../src/Components/Footer/Footer';
import '../src/index.css';
import styles from '../src/App.module.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div className={styles.app}>
    <Header />
    <div className={styles.content}>{children}</div>
    <Footer />
  </div>
);

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1, maximum-scale=1'
      />
      <title>Ratings</title>
    </Head>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </>
);

export default App;
