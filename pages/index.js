import Head from 'next/head';
import FeaturedNews from '../components/FeaturedNews';
import NewsGrid from '../components/NewsGrid';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <Layout withBackground>
      <Head>
        <title>Fundo Lotus - Página Inicial</title>
        <meta name="description" content="Bem-vindo a Lotus Habbo" />
      </Head>

      <div className={styles.container}>
        <FeaturedNews />
        <div className={styles.backgroundgrid}>
          <NewsGrid />
        </div>
      </div>
    </Layout>
  );
} 