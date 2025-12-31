import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useInteractionTracker from '../../hooks/useInteractionTracker';
import { trackClientEvent } from '../../utils/tracking';

export default function InteractionTracker() {
  useInteractionTracker();

  const location = useLocation();

  useEffect(() => {
    trackClientEvent('route_change', {
      route: location.pathname,
    });
  }, [location]);

  return null;
}
