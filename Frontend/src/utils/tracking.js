import { trackInteraction } from '../api/questionnaireApi';
import { ensureUser } from './user';

let cachedUid = null;
let deviceContextSent = false;

function baseContext() {
  if (typeof window === 'undefined') {
    return {};
  }

  return {
    page: window.location.pathname,
    title: document.title,
    referrer: document.referrer,
  };
}

export async function trackClientEvent(eventType, metadata = {}, options = {}) {
  if (typeof window === 'undefined') return;

  try {
    const user = await ensureUser();
    cachedUid = user.uid;

    await trackInteraction({
      uid: cachedUid,
      event_type: eventType,
      metadata: { ...baseContext(), ...metadata },
      page_url: window.location.href,
      user_agent: options.includeDevice || deviceContextSent ? navigator.userAgent : undefined,
      viewport_width: window.innerWidth || null,
      viewport_height: window.innerHeight || null,
      screen_width: window.screen?.width || null,
      screen_height: window.screen?.height || null,
    });

    if (options.includeDevice) {
      deviceContextSent = true;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.debug('Tracking error', error);
  }
}

export async function ensureDeviceContext() {
  if (deviceContextSent || typeof window === 'undefined') return;

  await trackClientEvent(
    'device_context',
    {
      language: navigator.language,
      platform: navigator.platform,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    { includeDevice: true },
  );
}
