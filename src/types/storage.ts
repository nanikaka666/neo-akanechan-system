import { Credentials } from "google-auth-library";
import { UserSettings } from "./userSettings";

/**
 * data interface which persisted in this app.
 */
export interface StorageData {
  userSettings: Partial<UserSettings>;
  authCredentials: Credentials;
  mainWindowBounds: Electron.Rectangle;
}

/**
 * DAO interface
 */
export interface StorageDao {
  get: <K extends keyof StorageData>(key: K) => StorageData[K] | undefined;
  getAll: () => Partial<StorageData>;
  set: <K extends keyof StorageData>(key: K, value: StorageData[K]) => void;
  delete: <K extends keyof StorageData>(key: K) => void;
  deleteAll: () => void;
}
