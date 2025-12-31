import { Link } from 'react-router-dom';
import './Home.css';
import usePageTracking from '../../hooks/usePageTracking';

export default function Home() {
  usePageTracking('home');

  return (
    <section className="home-hero">
      <p className="home-subtitle">Uw digitale parfumeur</p>

      <h1 className="home-title">
        Vind <span className="home-accent">uw</span> signatuur
      </h1>

      <p className="home-description">
        Slechts 5 vragen onthullen het parfum dat het beste bij u past. Geen verkoop,
        alleen perfect advies.
      </p>

      <div className="home-buttons">
        <Link
          to="/vragenlijst"
          className="btn-primary"
          data-track-id="home-start"
          data-track-event="cta_click"
        >
          Starten →
        </Link>

        <Link
          to="/explorer"
          className="btn-secondary"
          data-track-id="home-explorer"
          data-track-event="cta_click"
        >
          Ontdekken
        </Link>
      </div>
    </section>
  );
}
