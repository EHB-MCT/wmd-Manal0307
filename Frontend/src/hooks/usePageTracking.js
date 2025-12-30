import { useEffect } from 'react';
import { trackInteraction } from '../api/questionnaireApi';
import { ensureUser } from '../utils/user';

export default function usePageTracking(pageName) {
  useEffect(() => {
    const startedAt = Date.now();

    return () => {
      const duration = Math.round(((Date.now() - startedAt) / 1000) * 10) / 10;

      (async () => {
        try {
          const user = await ensureUser();
          if (!user?.uid) return;

          await trackInteraction({
            uid: user.uid,
            event_type: 'page_view',
            metadata: {
              page: pageName,
              duration,
            },
          });
        } catch (error) {
          // Tracking errors should not break navigation
        }
      })();
    };
  }, [pageName]);
}
