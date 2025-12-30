import axiosClient from './axiosClient';

export function getPerfumes() {
  return axiosClient.get('/perfumes');
}
