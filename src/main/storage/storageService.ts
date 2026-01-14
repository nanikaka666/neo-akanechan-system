import { StorageDao } from "../../types/storage";
import { UserSettings } from "../userSettings";
import { Credentials } from "google-auth-library";

/**
 * This class operates storage data controls.
 */
export class StorageService {
  readonly #dao: StorageDao;
  constructor(dao: StorageDao) {
    this.#dao = dao;
  }

  /**
   * Get user settings attached to given channel id.
   *
   * if no settings, `undefined` will be returned.
   * this function return *Partial* UserSettings because StorageData has possibility changing structure.
   */
  getUserSettings(): Partial<UserSettings> | undefined {
    return this.#dao.get("userSettings");
  }

  /**
   * Set user settings to given channel id.
   *
   * given new user settings must be complete shape UserSettings.
   * old settings data will be completely rewrote.
   */
  registerUserSettings(settings: UserSettings) {
    this.#dao.set("userSettings", settings);
  }

  /**
   * Retrieve auth credentials.
   */
  getAuthCredentials() {
    return this.#dao.get("authCredentials");
  }

  /**
   * Set credentials of Google OAuth.
   *
   * NOTE: this value must be encrypted but not here, because safeStorage is unavailable in apps which not code-signed.
   *
   * @param credentials
   */
  registerAuthCredentials(credentials: Credentials) {
    this.#dao.set("authCredentials", credentials);
  }

  /**
   * Delete Auth credentials.
   */
  deleteAuthCredentials() {
    this.#dao.delete("authCredentials");
  }

  /**
   * Get whole object stored in storage.
   */
  getAll() {
    return this.#dao.getAll();
  }

  /**
   * Clear all storage data.
   */
  clearAll() {
    this.#dao.deleteAll();
  }
}
