import { StorageDao } from "./types";
import { UserSettings } from "../userSettings";
import { Credentials } from "google-auth-library";
import { ChannelId } from "../youtubeApi/model";

/**
 * This class operates storage data controls.
 */
export class StorageService {
  readonly #dao: StorageDao;
  constructor(dao: StorageDao) {
    this.#dao = dao;
  }
  /**
   * Get the main ChannelId.
   *
   * if main channel was not there, `undefined` will be returned.
   */
  getMainChannelId() {
    const mainChannelId = this.#dao.get("mainChannelId");
    if (mainChannelId === undefined) {
      return undefined;
    } else {
      try {
        return new ChannelId(mainChannelId);
      } catch {
        // If process will be reached in here, stored data is broken. Delete it.
        this.#dao.delete("mainChannelId");
        return undefined;
      }
    }
  }

  /**
   * Add channel id to list and mark as main channel.
   *
   * Prerequisites: given channelId must be in Youtube ID style.
   */
  registerChannelIdAndMarkAsMain(channelId: ChannelId) {
    const list = this.#dao.get("registeredChannelIds") ?? [];

    // check it is already registered.
    if (list.filter((id) => id === channelId.id).length > 0) {
      return false;
    }
    const newList = [...list, channelId.id];
    this.#dao.set("registeredChannelIds", newList);
    this.#dao.set("mainChannelId", channelId.id);
    return true;
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
