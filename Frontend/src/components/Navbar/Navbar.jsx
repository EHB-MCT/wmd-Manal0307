import { NavLink } from 'react-router-dom';
import './Navbar.css';
import Button from '../Button/Button';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span>PARFUM</span>
        <span className="navbar__brand--light">ADVISOR</span>
      </div>

      <nav className="navbar__links">
        <NavLink
          to="/"
          data-track-id="nav-home"
          data-track-hover
          data-track-component="nav-link"
          data-track-cta="home"
        >
          Home
        </NavLink>
        <NavLink
          to="/vragenlijst"
          data-track-id="nav-quiz"
          data-track-hover
          data-track-component="nav-link"
          data-track-cta="quiz"
        >
          Vragenlijst
        </NavLink>
        <NavLink
          to="/explorer"
          data-track-id="nav-explorer"
          data-track-hover
          data-track-component="nav-link"
          data-track-cta="explorer"
        >
          Ontdekken
        </NavLink>
        <NavLink
          to="/dashboard"
          data-track-id="nav-dashboard"
          data-track-hover
          data-track-component="nav-link"
          data-track-cta="dashboard"
        >
          Dashboard
        </NavLink>
      </nav>

      <Button
        to="/vragenlijst"
        variant="dark"
        data-track-id="nav-cta-start"
        data-track-event="cta_click"
        data-track-component="nav-link"
        data-track-cta="start"
      >
        Starten
      </Button>
    </header>
  );
}
