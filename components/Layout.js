import Head from 'next/head';
import Navigation from './Navigation';
import Header from './Header';
import styles from '../styles/Layout.module.css';

export default function Layout({ children, title = 'Lotus Habbo' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Lotus Habbo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="../imgs/favicon.png" />
      </Head>

      <div className={styles.container}>
        <Header />
        <Navigation />
        <main className={styles.main}>
          {children}
        </main>

        <footer className={styles.footer}>
          <p>© {new Date().getFullYear()} Lotus Habbo. Todos os direitos reservados.</p>
        </footer>
      </div>
    </>
  );
} 