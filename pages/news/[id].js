import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import styles from '../../styles/News.module.css';

export default function NewsArticle() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setArticle(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout withBackground><div className={styles.container}>Carregando...</div></Layout>;
  if (error) return <Layout withBackground><div className={styles.container}>Erro: {error}</div></Layout>;
  if (!article) return <Layout withBackground><div className={styles.container}>Notícia não encontrada</div></Layout>;

  return (
    <Layout withBackground>
      <div className={styles.container}>
        <article className={styles.article}>
          <h1>{article.title}</h1>
          {article.image && (
            <img src={article.image} alt={article.title} className={styles.articleImage} />
          )}
          <div 
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: article.description }}
          />
          {article.link && (
            <a href={article.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
              Leia mais
            </a>
          )}
        </article>
      </div>
    </Layout>
  );
} 