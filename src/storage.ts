import Store from "electron-store";

interface StorageData {
  mainChannelId: string;
}

const store = new Store<StorageData>();

/**
 * This object used to access the storage.
 *
 * Detail of storage is hidden to a caller.
 * So, storage implementations will be changed with no effect for a caller.
 */
export const Storage = {
  get: <K extends keyof StorageData>(key: K): StorageData[K] => {
    return store.get(key);
  },
  set: <K extends keyof StorageData>(key: K, value: StorageData[K]) => {
    store.set(key, value);
  },
};
