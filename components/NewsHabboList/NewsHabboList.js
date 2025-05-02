import { useEffect, useState } from 'react';
import styles from './NewsHabboList.module.css';

const BASE_URL = 'https://habbo.com.br';
const HTML_URL = 'https://images.habbo.com/habbo-web-news/pt/production/front.html';

export default function NewsHabboList() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(HTML_URL);
        const htmlText = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        const articles = doc.querySelectorAll('article');
        const parsedItems = Array.from(articles).map((article) => {
          const title = article.querySelector('.news-header__title')?.textContent?.trim() || '';
          const img = article.querySelector('.news-header__image--thumbnail')?.getAttribute('src') || '';
          const desc = article.querySelector('.news-header__summary')?.textContent?.trim() || '';
          const href = article.querySelector('.news-header__link.news-header__banner')?.getAttribute('href') || '';

          return {
            title,
            image: img,
            description: desc,
            link: href.startsWith('http') ? href : `${BASE_URL}${href}`,
          };
        });

        setNewsItems(parsedItems);
      } catch (err) {
        console.error('Erro ao carregar notícias:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div className={styles.loading}>Carregando...</div>;

  return (
    <div className={styles.newsList}>
      {newsItems.map((item, idx) => (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.newsItem}
          key={idx}
        >
          <div className={styles.topRow}>
            <img src={item.image} alt={item.title} className={styles.thumb} />
            <h3 className={styles.title}>{item.title}</h3>
          </div>
          <p className={styles.description}>{item.description}</p>
        </a>
      ))}
    </div>
  );
}
