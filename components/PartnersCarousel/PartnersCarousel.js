import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import styles from './PartnersCarousel.module.css';

export default function PartnersCarousel() {
  const [partners, setPartners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchPartners();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (partners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((current) => 
        current === partners.length - 1 ? 0 : current + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [partners.length]);

  async function fetchPartners() {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  }

  function nextSlide() {
    setCurrentIndex((current) => 
      current === partners.length - 1 ? 0 : current + 1
    );
  }

  function prevSlide() {
    setCurrentIndex((current) => 
      current === 0 ? partners.length - 1 : current - 1
    );
  }

  if (partners.length === 0) return null;

  return (
    <div className={styles.carousel}>
      <div className={styles.slideContainer}>
        {partners.map((partner, index) => (
          <div
            key={partner.id}
            className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
          >
            <a
              href={partner.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => !partner.link && e.preventDefault()}
              className={styles.partnerLink}
            >
              <img
                src={partner.image_url}
                alt={`Partner ${index + 1}`}
                className={styles.partnerImage}
              />
            </a>
          </div>
        ))}
      </div>

      {partners.length > 1 && (
        <>
          <button 
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={prevSlide}
            aria-label="Previous partner"
          >
            ‹
          </button>
          <button 
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={nextSlide}
            aria-label="Next partner"
          >
            ›
          </button>
          <div className={styles.dots}>
            {partners.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to partner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
} 