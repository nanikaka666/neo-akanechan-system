import { StorageDao, StorageData } from "../../types/storage";
import Store from "electron-store";
import { isDevMode } from "../environment";

function getFileName() {
  return isDevMode() ? "config.dev" : "config.prod";
}

const store = new Store<StorageData>({
  name: getFileName(),
});

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
