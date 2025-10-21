import Store from "electron-store";

/**
 * data interface which persisted in this app.
 */
export interface StorageData {
  mainChannelId: string;
  registeredChannelIds: string[];
}

/**
 * DAO interface
 */
export interface StorageDao {
  get: <K extends keyof StorageData>(key: K) => StorageData[K];
  getAll: () => StorageData;
  set: <K extends keyof StorageData>(key: K, value: StorageData[K]) => void;
  delete: <K extends keyof StorageData>(key: K) => void;
  deleteAll: () => void;
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
  getAll: () => {
    return store.store;
  },
  set: <K extends keyof StorageData>(key: K, value: StorageData[K]) => {
    store.set(key, value);
  },
  delete: <K extends keyof StorageData>(key: K) => {
    store.delete(key);
  },
  deleteAll: () => {
    store.clear();
  },
};
