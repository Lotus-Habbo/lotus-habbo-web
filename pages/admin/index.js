import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import dynamic from 'next/dynamic';
import styles from '../../styles/Admin.module.css';
import 'react-quill/dist/quill.snow.css';

// Importação dinâmica do React-Quill para evitar erros de SSR
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Carregando editor...</p>,
});

// Configurações do editor
const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
];

export default function AdminNews() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    checkUser();
    fetchNews();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/admin/login');
    }
  }

  async function fetchNews() {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('News data structure:', data && data[0]);
      setNewsItems(data || []);
    } catch (error) {
      setError('Erro ao carregar notícias');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingId) {
        // Atualizar notícia existente
        const { error } = await supabase
          .from('news')
          .update({ 
            title, 
            description: content,
            image_url: imageUrl 
          })
          .eq('id', editingId);

        if (error) throw error;
      } else {
        // Criar nova notícia
        const { error } = await supabase
          .from('news')
          .insert([{ 
            title, 
            description: content,
            image_url: imageUrl 
          }]);

        if (error) throw error;
      }

      // Limpar formulário e recarregar notícias
      setTitle('');
      setContent('');
      setImageUrl('');
      setEditingId(null);
      await fetchNews();
    } catch (error) {
      setError('Erro ao salvar notícia');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Tem certeza que deseja excluir esta notícia?')) return;

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchNews();
    } catch (error) {
      setError('Erro ao excluir notícia');
      console.error('Error:', error);
    }
  }

  function handleEdit(news) {
    setEditingId(news.id);
    setTitle(news.title);
    setContent(news.description || '');
    setImageUrl(news.image_url || '');
  }

  function handleCancel() {
    setEditingId(null);
    setTitle('');
    setContent('');
    setImageUrl('');
  }

  if (loading) return <div>Carregando...</div>;

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1 className={styles.adminTitle}>
          {editingId ? 'Editar Notícia' : 'Adicionar Nova Notícia'}
        </h1>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.adminForm}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Título:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Conteúdo:</label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            className={styles.editor}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>URL da Imagem:</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={styles.formInput}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitButton}>
            {editingId ? 'Atualizar' : 'Adicionar'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className={styles.newsList}>
        <h2>Notícias Existentes</h2>
        {newsItems.map((news) => (
          <div key={news.id} className={styles.newsItem}>
            <h3>{news.title}</h3>
            <div className={styles.newsActions}>
              <button
                onClick={() => handleEdit(news)}
                className={styles.editButton}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(news.id)}
                className={styles.deleteButton}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 