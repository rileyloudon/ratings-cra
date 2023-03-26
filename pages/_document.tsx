import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => (
  <Html>
    <Head>
      <meta charSet='utf-8' />
      <link rel='icon' type='image/svg+xml' href='favicon.svg' />
      <link rel='icon' type='image/png' href='favicon.png' />
      <meta property='og:title' content='Ratings' />
      <meta property='og:image' content='og-image.png' />
      <meta name='theme-color' content='#161616' />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
