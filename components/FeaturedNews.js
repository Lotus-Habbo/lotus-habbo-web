import Link from 'next/link';
import styles from '../styles/FeaturedNews.module.css';

export default function FeaturedNews() {
  return (
    <div className={styles.featuredNews}>
      <div className={styles.featuredNewsOverlay}>
        <h2>Grande Evento Chegando!</h2>
        <p>Prepare-se para o maior evento do ano no LotusHabbo! Não perca as surpresas que estamos preparando.</p>
        <Link href="/noticia-destaque" className={styles.featuredNewsLink}>
          Leia mais
        </Link>
      </div>
    </div>
  );
} 