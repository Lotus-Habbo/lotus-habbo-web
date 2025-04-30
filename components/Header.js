import Image from 'next/image';
import styles from '../styles/Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <Image 
        src="/imgs/Valentines Day (9).png" 
        alt="LotusHabbo Logo"
        width={800}
        height={200}
        priority
      />
    </header>
  );
} 