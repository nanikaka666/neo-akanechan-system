import { UserSettings } from "../userSettings";

/**
 * data interface which persisted in this app.
 */
export interface StorageData {
  mainChannelId: string;
  registeredChannelIds: string[];
  userSettings: Record<string, Partial<UserSettings>>;
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
