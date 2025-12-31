import { Link } from 'react-router-dom';
import './Home.css';
import usePageTracking from '../../hooks/usePageTracking';
import useUserProfile from '../../hooks/useUserProfile';

export default function Home() {
  usePageTracking('home');
  const { profile, latestAction } = useUserProfile();

  const isFlagged = latestAction?.action_type === 'flag';
  const isPromoted = latestAction?.action_type === 'promote';

  const description =
    profile?.segment === 'luxury_high_spender'
      ? 'We selecteren reeds de meest exclusieve parfums voor uw smaak.'
      : profile?.segment === 'low_attention'
        ? 'Slechts een paar minuten volstaan om uw match te vinden. We houden het snel.'
        : 'Slechts 5 vragen onthullen het parfum dat het beste bij u past. Geen verkoop, alleen perfect advies.';

  const ctas = [
    {
      key: 'start',
      to: '/vragenlijst',
      label: 'Starten →',
      className: 'btn-primary',
    },
    {
      key: 'explorer',
      to: '/explorer',
      label: 'Ontdekken',
      className: 'btn-secondary',
    },
  ];

  const orderedCtas = isPromoted ? [ctas[1], ctas[0]] : ctas;

  return (
    <section className="home-hero">
      <p className="home-subtitle">Uw digitale parfumeur</p>

      <h1 className="home-title">
        Vind <span className="home-accent">uw</span> signatuur
      </h1>

      <p className="home-description">{description}</p>

      {latestAction && (
        <div className={`home-alert home-alert--${latestAction.action_type}`}>
          {isFlagged && 'Voor uw toezicht: voltooi de vragenlijst opnieuw zodat uw profiel geactiveerd blijft.'}
          {isPromoted && 'Speciale aanbevelingen wachten op u in de ontdek-sectie.'}
        </div>
      )}

      <div className={`home-buttons ${isPromoted ? 'home-buttons--promo' : ''}`}>
        {orderedCtas.map((cta) => (
          <Link
            key={cta.key}
            to={cta.to}
            className={cta.className}
            data-track-id={`home-${cta.key}`}
            data-track-event="cta_click"
            data-track-component="home-cta"
            data-track-cta={cta.key}
          >
            {cta.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
