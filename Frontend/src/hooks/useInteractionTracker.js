import { useEffect, useRef } from 'react';
import throttle from '../utils/throttle';
import { ensureDeviceContext, trackClientEvent } from '../utils/tracking';

const HOVER_COOLDOWN = 5000;

function extractTargetMetadata(target) {
  if (!target) {
    return null;
  }

  const dataset = target.dataset || {};
  const trackId = dataset.trackId || null;
  const label =
    dataset.trackLabel || target.innerText?.trim()?.slice(0, 80) || target.getAttribute('aria-label');

  return {
    id: trackId,
    label,
    tag: target.tagName,
    role: target.getAttribute('role'),
    route: dataset.trackRoute || null,
  };
}

export default function useInteractionTracker() {
  const hoverCacheRef = useRef(new Map());

  useEffect(() => {
    ensureDeviceContext();

    const handleClick = (event) => {
      const trackedTarget = event.target.closest('[data-track-id]');
      const metadata = extractTargetMetadata(trackedTarget || event.target);
      const eventType = trackedTarget?.dataset?.trackEvent || 'click';

      trackClientEvent(eventType, {
        ...metadata,
        x: event.clientX,
        y: event.clientY,
      });
    };

    const handleMouseOver = (event) => {
      const target = event.target.closest('[data-track-hover]');
      if (!target) return;

      const metadata = extractTargetMetadata(target);
      const cacheKey = metadata?.id || metadata?.label || target.tagName;
      const now = Date.now();

      const lastHover = hoverCacheRef.current.get(cacheKey) || 0;
      if (now - lastHover < HOVER_COOLDOWN) return;

      hoverCacheRef.current.set(cacheKey, now);
      trackClientEvent('hover', metadata);
    };

    const handleCopy = (event) => {
      trackClientEvent('copy', {
        length: event.clipboardData?.getData('text/plain')?.length || 0,
      });
    };

    const handleVisibility = () => {
      trackClientEvent(document.hidden ? 'tab_hidden' : 'tab_visible');
    };

    const handleExitIntent = (event) => {
      if (event.clientY <= 0 || event.relatedTarget === null) {
        trackClientEvent('exit_intent');
      }
    };

    const handleScroll = throttle(() => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      const percentage = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;

      trackClientEvent('scroll_depth', { percentage });
    }, 2000);

    const handleKeyDown = (event) => {
      if (['Escape', 'Enter'].includes(event.key)) {
        trackClientEvent('key_press', { key: event.key });
      }
    };

    document.addEventListener('click', handleClick, true);
    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('visibilitychange', handleVisibility);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mouseout', handleExitIntent);
    window.addEventListener('beforeunload', handleExitIntent);

    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('visibilitychange', handleVisibility);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mouseout', handleExitIntent);
      window.removeEventListener('beforeunload', handleExitIntent);
    };
  }, []);
}
