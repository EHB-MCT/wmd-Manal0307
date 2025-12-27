import axiosClient from './axiosClient';

export function getOverview() {
  return axiosClient.get('/admin/overview');
}

export function getQuestionStats() {
  return axiosClient.get('/admin/questions');
}

export function getUsers() {
  return axiosClient.get('/admin/users');
}

export function getUserDetail(uid) {
  return axiosClient.get(`/admin/users/${uid}`);
}

export function getComparisons() {
  return axiosClient.get('/admin/comparisons');
}
