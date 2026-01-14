import { Credentials } from "google-auth-library";
import { UserSettings } from "../main/userSettings";

/**
 * data interface which persisted in this app.
 */
export interface StorageData {
  userSettings: Partial<UserSettings>;
  authCredentials: Credentials;
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
