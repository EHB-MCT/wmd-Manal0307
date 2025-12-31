import { initUser } from '../api/userApi';

let cachedUser = null;
let pendingRequest = null;

function readUidFromStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem('parfum_uid');
}

function writeUidToStorage(uid) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem('parfum_uid', uid);
}

export async function ensureUser() {
  if (cachedUser) {
    return cachedUser;
  }

  if (!pendingRequest) {
    pendingRequest = (async () => {
      const existingUid = readUidFromStorage() || undefined;
      const user = await initUser(existingUid);
      writeUidToStorage(user.uid);
      cachedUser = user;
      pendingRequest = null;
      return user;
    })().catch((error) => {
      pendingRequest = null;
      throw error;
    });
  }

  return pendingRequest;
}

export function getStoredUid() {
  if (cachedUser) {
    return cachedUser.uid;
  }

  return readUidFromStorage();
}
