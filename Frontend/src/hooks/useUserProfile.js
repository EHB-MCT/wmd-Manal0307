import { useCallback, useEffect, useState } from 'react';
import { getProfile } from '../api/userApi';
import { ensureUser } from '../utils/user';

export default function useUserProfile() {
  const [profile, setProfile] = useState(null);
  const [latestAction, setLatestAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshProfile = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await ensureUser();
      if (!currentUser?.uid) return;
      const data = await getProfile(currentUser.uid);
      if (data?.profile) {
        setProfile(data.profile);
        setLatestAction(data.latest_action || null);
      } else {
        setProfile(data);
        setLatestAction(null);
      }
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  return { profile, latestAction, loading, error, refreshProfile };
}
