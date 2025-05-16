import Link from 'next/link';
import styles from '../styles/FeaturedNews.module.css';

export default function FeaturedNews() {
  return (
    <div className={styles.featuredNews}>
      <div className={styles.featuredNewsOverlay}>
        <h2>Grande Evento Chegando!</h2>
        <p>Prepare-se para o evento de competição de quartos Casa Alphaville LotusHabbo!.</p>
        <Link href="https://discord.com/channels/@me/1366957073279094815/1373052442161446933" className={styles.featuredNewsLink}>
          Inscreva-se aqui
        </Link>
      </div>
    </div>
  );
} 