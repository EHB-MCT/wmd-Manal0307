import { useEffect, useState } from 'react';
import './Explorer.css';
import { getPerfumes } from '../../api/perfumeApi';
import { saveComparison } from '../../api/questionnaireApi';
import usePageTracking from '../../hooks/usePageTracking';
import { ensureUser } from '../../utils/user';

export default function Explorer() {
  const [perfumes, setPerfumes] = useState([]);
  const [selected, setSelected] = useState([]);
  const [winnerId, setWinnerId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
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

  function toggleSelect(perfume) {
    setMessage('');
    setSelected((prev) => {
      const exists = prev.find((item) => item.id === perfume.id);
      if (exists) {
        if (winnerId === perfume.id) {
          setWinnerId(null);
        }
        return prev.filter((item) => item.id !== perfume.id);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, perfume];
    });
  }

  async function handleSaveComparison() {
    try {
      if (selected.length < 2 || !winnerId) return;
      setSaving(true);
      const user = await ensureUser();
      await saveComparison({
        uid: user.uid,
        perfumes: selected.map((item) => ({
          id: item.id,
          is_winner: item.id === winnerId,
        })),
      });
      setMessage('Vergelijking opgeslagen. Dank u!');
      setSelected([]);
      setWinnerId(null);
    } catch (error) {
      setMessage('Opslaan mislukt. Probeer opnieuw.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="explorer">
      <header>
        <p className="subtitle">Ontdek</p>
        <h1>Curatie van parfums</h1>
        <p>Bekijk onze selectie en vind inspiratie terwijl u wacht op uw aanbeveling.</p>
      </header>

      <div className="comparison-panel">
        <div>
          <h2>Vergelijk handmatig</h2>
          <p>
            Kies tot 3 parfums en duid een winnaar aan. Hiermee leren we uw voorkeuren en wordt het
            dashboard bijgewerkt.
          </p>
        </div>
        <div className="selected-grid">
          {selected.map((item) => (
            <label key={item.id} className="selected-chip">
              <input
                type="radio"
                name="winner"
                value={item.id}
                checked={winnerId === item.id}
                onChange={() => setWinnerId(item.id)}
              />
              <span>{item.name}</span>
            </label>
          ))}
          {!selected.length && <p>Geen selectie. Klik op een kaart om te beginnen.</p>}
        </div>
        <div className="comparison-actions">
          <button
            type="button"
            className="btn-compare"
            disabled={selected.length < 2 || !winnerId || saving}
            onClick={handleSaveComparison}
            data-track-id="explorer-save-comparison"
            data-track-event="cta_click"
          >
            {saving ? 'Opslaan...' : 'Bewaar vergelijking'}
          </button>
          {message && <p className="comparison-message">{message}</p>}
        </div>
      </div>

      <div className="explorer-grid">
        {perfumes.map((perfume) => (
          <article
            key={perfume.id}
            className="explorer-card"
            data-track-id={`explorer-card-${perfume.id}`}
            data-track-hover
            data-track-event="cta_hover"
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
            <button
              type="button"
              className="select-button"
              onClick={() => toggleSelect(perfume)}
              data-track-id={`select-perfume-${perfume.id}`}
            >
              {selected.find((item) => item.id === perfume.id) ? 'Verwijder' : 'Selecteer'}
            </button>
          </article>
        ))}

        {!perfumes.length && <p>Collectie wordt geladen...</p>}
      </div>
    </section>
  );
}
