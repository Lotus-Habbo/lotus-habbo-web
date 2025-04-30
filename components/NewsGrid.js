import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import styles from '../styles/NewsGrid.module.css';

export default function NewsGrid() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNewsItems(data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return '/imgs/placeholder.png';
    if (url.startsWith('http')) return url;
    return url;
  };

  // Função para extrair texto puro do HTML
  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (loading) return <div className={styles.loading}>Carregando notícias...</div>;
  if (error) return <div className={styles.error}>Erro ao carregar notícias: {error}</div>;

  return (
    <div className={styles.newsGrid}>
      {newsItems.map((item) => (
        <Link href={`/news/${item.id}`} key={item.id} className={styles.newsCard}>
          <div className={styles.newsImageContainer}>
            <img 
              src={getImageUrl(item.image)} 
              alt={item.title} 
              className={styles.newsImage}
            />
          </div>
          <div className={styles.newsContent}>
            <h3>{item.title}</h3>
            <p className={styles.preview}>
              {stripHtml(item.description).substring(0, 100)}...
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
} 