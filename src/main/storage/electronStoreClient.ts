import { StorageDao, StorageData } from "./storage";
import Store from "electron-store";

const store = new Store<StorageData>();

/**
 * Dao Client using electron-store.
 */
export const ElectronStoreClient: StorageDao = {
  get: (key) => {
    return store.get(key);
  },
  getAll: () => {
    return store.store;
  },
  set: (key, value) => {
    store.set(key, value);
  },
  delete: (key) => {
    store.delete(key);
  },
  deleteAll: () => {
    store.clear();
  },
};
