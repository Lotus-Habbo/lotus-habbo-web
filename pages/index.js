import Head from 'next/head';
import FeaturedNews from '../components/FeaturedNews';
import NewsGrid from '../components/NewsGrid';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import NewsHabboList from '../components/NewsHabboList/NewsHabboList';

export default function Home() {
  return (
    <Layout withBackground>
      <Head>
        <title>Lotus Habbo - Página Inicial</title>
        <meta name="description" content="Bem-vindo a Lotus Habbo" />
      </Head>

      <div className={styles.container}>
        <FeaturedNews />
        <div className={styles.contentSplit}>
          <div className={styles.backgroundgrid}>
            <NewsGrid />
          </div>
          <div className={styles.newsSide}>
            <div className={styles.newsSideHeader}>Notícias Oficiais</div>
            <NewsHabboList />
          </div>
        </div>
      </div>
    </Layout>
  );
}
