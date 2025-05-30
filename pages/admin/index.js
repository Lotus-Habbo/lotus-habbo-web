import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import dynamic from 'next/dynamic';
import styles from '../../styles/Admin.module.css';
import 'react-quill/dist/quill.snow.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

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
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image',
  'background', 'color'
];

// Add custom styles for the editor
const customStyles = `
  .ql-editor .topic-highlight {
    background-color: #0066cc;
    color: white;
    padding: 4px 8px;
    border-radius: 6px;
    margin: 2px 0;
    display: inline-block;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }

  .ql-editor .topic-highlight:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }

  /* Estilos para diferentes variações de tópicos */
  .ql-editor .topic-highlight.primary {
    background-color: #0066cc;
    color: white;
  }

  .ql-editor .topic-highlight.secondary {
    background-color: #4CAF50;
    color: white;
  }

  .ql-editor .topic-highlight.accent {
    background-color: #FF9800;
    color: white;
  }

  .ql-editor .topic-highlight.warning {
    background-color: #f44336;
    color: white;
  }

  /* Estilo para o seletor de cores do editor */
  .ql-color-picker .ql-picker-label,
  .ql-background .ql-picker-label {
    padding: 3px 5px;
  }

  .ql-color-picker .ql-picker-options,
  .ql-background .ql-picker-options {
    padding: 8px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

// Carousel configuration
const carouselResponsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1
  }
};

export default function AdminNews() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  // Partners state
  const [partners, setPartners] = useState([]);
  const [partnerImage, setPartnerImage] = useState('');
  const [partnerLink, setPartnerLink] = useState('');
  const [editingPartnerId, setEditingPartnerId] = useState(null);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    checkUser();
    fetchNews();
    fetchPartners();
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
        .from('news_preview')
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

  async function fetchPartners() {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      setError('Erro ao carregar parceiros');
      console.error('Error:', error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingId) {
        // Buscar a notícia completa da tabela news
        const { data: newsData, error: fetchError } = await supabase
          .from('news')
          .select('*')
          .eq('id', editingId)
          .single();

        if (fetchError) throw fetchError;

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

  async function handleEdit(news) {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', news.id)
        .single();

      if (error) throw error;

      setEditingId(news.id);
      setTitle(data.title);
      setContent(data.description || '');
      setImageUrl(data.image_url || '');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setError('Erro ao carregar notícia para edição');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setEditingId(null);
    setTitle('');
    setContent('');
    setImageUrl('');
  }

  async function handlePartnerSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingPartnerId) {
        const { error } = await supabase
          .from('partners')
          .update({ 
            image_url: partnerImage,
            link: partnerLink
          })
          .eq('id', editingPartnerId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('partners')
          .insert([{ 
            image_url: partnerImage,
            link: partnerLink
          }]);

        if (error) throw error;
      }

      setPartnerImage('');
      setPartnerLink('');
      setEditingPartnerId(null);
      setShowPartnerForm(false);
      await fetchPartners();
    } catch (error) {
      setError('Erro ao salvar parceiro');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePartner(id) {
    if (!window.confirm('Tem certeza que deseja excluir este parceiro?')) return;

    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPartners();
    } catch (error) {
      setError('Erro ao excluir parceiro');
      console.error('Error:', error);
    }
  }

  function handleEditPartner(partner) {
    setEditingPartnerId(partner.id);
    setPartnerImage(partner.image_url);
    setPartnerLink(partner.link || '');
    setShowPartnerForm(true);
  }

  function handleCancelPartner() {
    setEditingPartnerId(null);
    setPartnerImage('');
    setPartnerLink('');
    setShowPartnerForm(false);
  }

  if (loading) return <div className={styles.loading}>Carregando...</div>;

  return (
    <div className={styles.adminContainer}>
      <style jsx global>{customStyles}</style>
      
      {/* Partners Section */}
      <div className={styles.partnersSection}>
        <div className={styles.sectionHeader}>
          <h2>Parceiros</h2>
          <button 
            onClick={() => setShowPartnerForm(!showPartnerForm)}
            className={styles.addButton}
          >
            {showPartnerForm ? 'Cancelar' : 'Adicionar Parceiro'}
          </button>
        </div>

        {showPartnerForm && (
          <form onSubmit={handlePartnerSubmit} className={styles.partnerForm}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>URL da Imagem:</label>
              <input
                type="url"
                value={partnerImage}
                onChange={(e) => setPartnerImage(e.target.value)}
                required
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Link (opcional):</label>
              <input
                type="url"
                value={partnerLink}
                onChange={(e) => setPartnerLink(e.target.value)}
                className={styles.formInput}
              />
            </div>

            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.submitButton}>
                {editingPartnerId ? 'Atualizar' : 'Adicionar'}
              </button>
              {editingPartnerId && (
                <button
                  type="button"
                  onClick={handleCancelPartner}
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        )}

        {/* Partners Carousel */}
        <div className={styles.partnersCarousel}>
          <div className={styles.carouselWrapper}>
            <Carousel
              responsive={carouselResponsive}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={3000}
              keyBoardControl={true}
              customTransition="all .5"
              transitionDuration={500}
              removeArrowOnDeviceType={["tablet", "mobile"]}
            >
              {partners.map((partner) => (
                <div key={partner.id} className={styles.partnerItem}>
                  <a 
                    href={partner.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.partnerLink}
                  >
                    <img 
                      src={partner.image_url} 
                      alt="Partner" 
                      className={styles.partnerImage}
                    />
                  </a>
                  <div className={styles.partnerActions}>
                    <button
                      onClick={() => handleEditPartner(partner)}
                      className={styles.editButton}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeletePartner(partner.id)}
                      className={styles.deleteButton}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>

      {/* Existing News Section */}
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