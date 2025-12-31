import axiosClient from './axiosClient';

export function getOverview() {
  return axiosClient.get('/admin/overview');
}

export function getQuestionStats() {
  return axiosClient.get('/admin/questions');
}

export function getUsers(params = {}) {
  const query = new URLSearchParams(params).toString();
  const suffix = query ? `?${query}` : '';
  return axiosClient.get(`/admin/users${suffix}`);
}

export function getUserDetail(uid, params = {}) {
  const query = new URLSearchParams(params).toString();
  const suffix = query ? `?${query}` : '';
  return axiosClient.get(`/admin/users/${uid}${suffix}`);
}

export function getComparisons() {
  return axiosClient.get('/admin/comparisons');
}
