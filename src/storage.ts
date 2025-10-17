import Store from "electron-store";

export interface StorageData {
  mainChannelId: string;
}

const store = new Store<StorageData>();

export const Storage = {
  get: <K extends keyof StorageData>(key: K): StorageData[K] => {
    return store.get(key);
  },
  set: <K extends keyof StorageData>(key: K, value: StorageData[K]) => {
    store.set(key, value);
  },
};
