import { useEffect, useRef, useState } from 'react';
import './Results.css';
import { getRecommendations, saveComparison } from '../../api/questionnaireApi';
import usePageTracking from '../../hooks/usePageTracking';
import { ensureUser } from '../../utils/user';
import useUserProfile from '../../hooks/useUserProfile';

export default function Results() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const comparisonLogged = useRef(false);
  usePageTracking('results');
  const { profile, refreshProfile } = useUserProfile();

  useEffect(() => {
    async function load() {
      try {
        const currentUser = await ensureUser();
        if (!currentUser?.uid) return;
        const data = await getRecommendations(currentUser.uid);
        setRecommendations(data);
        await refreshProfile();

         if (!comparisonLogged.current && Array.isArray(data) && data.length >= 2) {
           comparisonLogged.current = true;
           const perfumes = data.slice(0, 3).map((item, index) => ({
             id: item.id,
             is_winner: index === 0,
           }));

           try {
             await saveComparison({ uid: currentUser.uid, perfumes });
           } catch (error) {
             // dashboard data only
           }
         }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <section className="results">
      <header>
        <p className="subtitle">Uw selectie</p>
        <h1>Persoonlijke aanbevelingen</h1>
        <p>
          Gebaseerd op uw antwoorden presenteren we parfums die het dichtst bij uw huidige mood
          aansluiten.
        </p>
      </header>

      {profile && (
        <div className={`results-nudge results-nudge--${profile.segment || 'default'}`}>
          <div>
            <strong>Profielstatus</strong>
            <p>Segment: {profile.segment || 'onbekend'}</p>
            <p>Score: {profile.score?.toFixed?.(1) ?? profile.score ?? 0}/100</p>
          </div>
          <div>
            {profile.segment === 'luxury_high_spender' && 'Exclusieve parfums komen bovenaan uw lijst.'}
            {profile.segment === 'premium_target' && 'We benadrukken premium keuzes voor uw tempo.'}
            {profile.segment === 'low_attention' && 'We tonen de eenvoudigste opties eerst voor snelle beslissers.'}
            {!profile.segment && 'Voltooi de vragenlijst voor nog betere aanbevelingen.'}
          </div>
        </div>
      )}

      {loading && <p>Laden...</p>}

      {!loading && !recommendations.length && <p>Geen aanbevelingen gevonden.</p>}

      <div className="results-grid">
        {recommendations.map((item, index) => (
          <article
            key={item.id}
            className="results-card"
            data-track-id={`result-card-${item.id}`}
            data-track-label={item.name}
            data-track-hover
          >
            {item.image_url && (
              <div className="results-card__image">
                <img src={item.image_url} alt={item.name} loading="lazy" />
              </div>
            )}
            <h3>{item.name}</h3>
            <p className="brand">{item.brand}</p>
            <p>{item.family}</p>
            <p className="mood">Mood: {item.mood}</p>
            <p className="notes">
              <strong>Top:</strong> {item.notes_top} <br />
              <strong>Hart:</strong> {item.notes_middle} <br />
              <strong>Basis:</strong> {item.notes_base}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
