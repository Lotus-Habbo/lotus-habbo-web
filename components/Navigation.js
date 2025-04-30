import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Navigation.module.css';

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.navLink}>
        <Image src="/imgs/LOTUS (1).png" alt="Ícone Home" width={30} height={30} />
        Home
      </Link>
      <Link href="/sobre" className={styles.navLink}>
        <Image src="/imgs/438__-3jL.png" alt="Ícone Sobre" width={30} height={30} />
        Sobre Nós
      </Link>
    </nav>
  );
} 