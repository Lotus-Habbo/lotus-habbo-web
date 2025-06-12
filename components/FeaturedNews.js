import Link from 'next/link';
import styles from '../styles/FeaturedNews.module.css';

export default function FeaturedNews() {
  return (
    <div className={styles.featuredNews}>
      <div className={styles.featuredNewsOverlay}>
        <h2>Grande Evento Chegando!</h2>
        <p>Mostre seu talento e construa o Arraiá mais encantador do Habbo Hotel!</p>
        <Link href="https://discord.gg/7gMGgTSBJT" className={styles.featuredNewsLink}>
          Inscreva-se aqui
        </Link>
      </div>
    </div>
  );
} 