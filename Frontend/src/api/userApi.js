import axiosClient from './axiosClient';

export async function initUser(existingUid) {
  const payload = existingUid ? { uid: existingUid } : {};
  return axiosClient.post('/user/init', payload);
}
