import { describe, expect, it } from 'vitest';
import { extractTargetMetadata } from './useInteractionTracker';

describe('extractTargetMetadata', () => {
  it('leest dataset en vult fallback velden', () => {
    const target = {
      dataset: {
        trackId: 'cta-home',
        trackLabel: 'Starten',
        trackRoute: '/home',
        trackComponent: 'hero-cta',
        trackCta: 'start',
        trackSection: 'hero',
      },
      tagName: 'BUTTON',
      getAttribute: (name) => (name === 'role' ? 'button' : null),
      innerText: 'Starten',
    };

    expect(extractTargetMetadata(target)).toEqual({
      id: 'cta-home',
      label: 'Starten',
      tag: 'BUTTON',
      role: 'button',
      route: '/home',
      component: 'hero-cta',
      cta: 'start',
      section: 'hero',
    });
  });

  it('geeft null terug wanneer target ontbreekt', () => {
    expect(extractTargetMetadata(null)).toBeNull();
  });
});
