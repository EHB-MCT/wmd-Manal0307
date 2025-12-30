import { Link } from 'react-router-dom';
import './Button.css';

export default function Button({ to, children, variant = 'light', ...props }) {
  if (to) {
    return (
      <Link to={to} className={`btn btn-${variant}`} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
}
