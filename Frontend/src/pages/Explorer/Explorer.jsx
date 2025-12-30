import { useEffect, useState } from 'react';
import './Explorer.css';
import { getPerfumes } from '../../api/perfumeApi';
import usePageTracking from '../../hooks/usePageTracking';

export default function Explorer() {
  const [perfumes, setPerfumes] = useState([]);
  usePageTracking('explorer');

  useEffect(() => {
    async function load() {
      try {
        const data = await getPerfumes();
        setPerfumes(data);
      } catch (error) {
        setPerfumes([]);
      }
    }

    load();
  }, []);

  return (
    <section className="explorer">
      <header>
        <p className="subtitle">Ontdek</p>
        <h1>Curatie van parfums</h1>
        <p>Bekijk onze selectie en vind inspiratie terwijl u wacht op uw aanbeveling.</p>
      </header>

      <div className="explorer-grid">
        {perfumes.map((perfume) => (
          <article
            key={perfume.id}
            className="explorer-card"
            data-track-id={`explorer-card-${perfume.id}`}
            data-track-hover
          >
            {perfume.image_url && (
              <div className="explorer-card__image">
                <img src={perfume.image_url} alt={perfume.name} loading="lazy" />
              </div>
            )}
            <h3>{perfume.name}</h3>
            <p className="brand">{perfume.brand}</p>
            <p className="family">{perfume.family}</p>
            <p className="mood">Mood: {perfume.mood || '—'}</p>
          </article>
        ))}

        {!perfumes.length && <p>Collectie wordt geladen...</p>}
      </div>
    </section>
  );
}
