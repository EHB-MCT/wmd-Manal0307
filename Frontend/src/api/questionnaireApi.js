import axiosClient from './axiosClient';

export function getQuestions() {
  return axiosClient.get('/questions');
}

export function sendAnswer(payload) {
  return axiosClient.post('/answers', payload);
}

export function trackInteraction(payload) {
  return axiosClient.post('/track', payload);
}

export function getRecommendations(uid) {
  return axiosClient.get(`/recommendations/${uid}`);
}

export function saveComparison(payload) {
  return axiosClient.post('/comparisons', payload);
}
