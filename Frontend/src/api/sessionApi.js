import axiosClient from './axiosClient';

export function startSession(uid) {
  return axiosClient.post('/sessions/start', { uid });
}

export function endSession(sessionId, payload = {}) {
  return axiosClient.post('/sessions/end', { session_id: sessionId, ...payload });
}
