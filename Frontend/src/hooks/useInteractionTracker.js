import { useEffect, useRef } from 'react';
import throttle from '../utils/throttle';
import { ensureDeviceContext, trackClientEvent } from '../utils/tracking';

const HOVER_COOLDOWN = 5000;
const IDLE_TIMEOUT = 30000;

export function extractTargetMetadata(target) {
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
    component: dataset.trackComponent || null,
    cta: dataset.trackCta || null,
    section: dataset.trackSection || null,
  };
}

export default function useInteractionTracker() {
  const hoverCacheRef = useRef(new Map());
  const idleTimerRef = useRef(null);
  const isIdleRef = useRef(false);

  const resetIdleTimer = () => {
    if (typeof window === 'undefined') return;

    if (isIdleRef.current) {
      trackClientEvent('idle_end');
      isIdleRef.current = false;
    }

    clearTimeout(idleTimerRef.current);

    idleTimerRef.current = setTimeout(() => {
      trackClientEvent('idle_start');
      isIdleRef.current = true;
    }, IDLE_TIMEOUT);
  };

  useEffect(() => {
    ensureDeviceContext();
    resetIdleTimer();

    const handleClick = (event) => {
      const trackedTarget = event.target.closest('[data-track-id]');

      if (!trackedTarget) {
        trackClientEvent('misclick', {
          tag: event.target.tagName,
          x: event.clientX,
          y: event.clientY,
        });
        resetIdleTimer();
        return;
      }

      const metadata = extractTargetMetadata(trackedTarget);
      const eventType = trackedTarget.dataset?.trackEvent || 'click';

      trackClientEvent(eventType, {
        ...metadata,
        x: event.clientX,
        y: event.clientY,
      });
      resetIdleTimer();
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
      const eventType = target.dataset?.trackEvent || 'hover';
      trackClientEvent(eventType, metadata);
    };

    const handleCopy = (event) => {
      trackClientEvent('copy', {
        length: event.clipboardData?.getData('text/plain')?.length || 0,
      });
      resetIdleTimer();
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
      resetIdleTimer();
    }, 2000);

    const handleKeyDown = (event) => {
      if (['Escape', 'Enter'].includes(event.key)) {
        trackClientEvent('key_press', { key: event.key });
      }
      resetIdleTimer();
    };

    const handleMouseMove = throttle(() => {
      resetIdleTimer();
    }, 1000);

    const handleFocus = (event) => {
      const target = event.target;
      if (!target.matches('input, textarea, select, button')) return;

      trackClientEvent('input_focus', {
        name: target.name,
        id: target.id,
        type: target.type,
      });
    };

    const handleBlur = (event) => {
      const target = event.target;
      if (!target.matches('input, textarea, select, button')) return;

      trackClientEvent('input_blur', {
        name: target.name,
        id: target.id,
        type: target.type,
        value_length: target.value?.length || 0,
      });
    };

    const handleDoubleClick = (event) => {
      const metadata = extractTargetMetadata(event.target);
      trackClientEvent('double_click', {
        ...metadata,
        x: event.clientX,
        y: event.clientY,
      });
      resetIdleTimer();
    };

    const handleDragStart = (event) => {
      const target = event.target.closest('[data-track-id]');
      if (!target) return;

      trackClientEvent('drag_start', extractTargetMetadata(target));
    };

    const handleDrop = (event) => {
      const target = event.target.closest('[data-track-id]');
      if (!target) return;

      trackClientEvent('drop', extractTargetMetadata(target));
    };

    document.addEventListener('click', handleClick, true);
    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('visibilitychange', handleVisibility);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);
    document.addEventListener('dblclick', handleDoubleClick, true);
    document.addEventListener('dragstart', handleDragStart, true);
    document.addEventListener('drop', handleDrop, true);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mouseout', handleExitIntent);
    window.addEventListener('beforeunload', handleExitIntent);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('visibilitychange', handleVisibility);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
      document.removeEventListener('dblclick', handleDoubleClick, true);
      document.removeEventListener('dragstart', handleDragStart, true);
      document.removeEventListener('drop', handleDrop, true);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mouseout', handleExitIntent);
      window.removeEventListener('beforeunload', handleExitIntent);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(idleTimerRef.current);
    };
  }, []);
}
