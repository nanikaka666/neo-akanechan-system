import Store from "electron-store";
import { ChannelId } from "youtube-live-scraper";

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
  delete: <K extends keyof StorageData>(key: K) => {
    store.delete(key);
  },
};

/**
 * This object has functions contains application logics.
 */
export const StorageService = {
  /**
   * Get the main ChannelId.
   *
   * if main channel was not there, `undefined` will be returned.
   */
  getMainChannelId: () => {
    const mainChannelId = Storage.get("mainChannelId");
    if (mainChannelId === undefined) {
      return undefined;
    } else {
      try {
        return new ChannelId(mainChannelId);
      } catch {
        // If process will be reached in here, stored data is broken. Delete it.
        Storage.delete("mainChannelId");
        return undefined;
      }
    }
  },
};
