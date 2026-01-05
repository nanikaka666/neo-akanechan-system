import { StorageDao } from "./types";
import { UserSettings } from "../userSettings";
import { ChannelSummary } from "../../ipcEvent";
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

  getRegisteredChannelIds() {
    return this.#dao.get("registeredChannelIds").map((id) => {
      return new ChannelId(id);
    });
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
   * Switch main channel.
   *
   * main channel is must be listed in `registeredChannelIds`.
   */
  switchMainChannel(channelId: ChannelId) {
    const list = this.#dao.get("registeredChannelIds") ?? [];

    // check: channelId is registered.
    if (list.filter((id) => id === channelId.id).length === 0) {
      return false;
    }
    this.#dao.set("mainChannelId", channelId.id);
    return true;
  }

  /**
   * Delete channel data.
   */
  deleteChannel(channel: ChannelSummary) {
    const nextChannelIds = (this.#dao.get("registeredChannelIds") ?? []).filter(
      (id) => id !== channel.channelId.id,
    );
    this.#dao.set("registeredChannelIds", nextChannelIds);

    if (this.#dao.get("mainChannelId") === channel.channelId.id) {
      if (nextChannelIds.length === 0) {
        this.#dao.delete("mainChannelId");
      } else {
        this.#dao.set("mainChannelId", nextChannelIds[0]);
      }
    }

    const userSettings = this.#dao.get("userSettings");
    if (userSettings !== undefined && channel.channelId.id in userSettings) {
      const { [channel.channelId.id]: _, ...rest } = userSettings;
      this.#dao.set("userSettings", rest);
    }
  }

  /**
   * Get user settings attached to given channel id.
   *
   * if no settings, `undefined` will be returned.
   * this function return *Partial* UserSettings because StorageData has possibility changing structure.
   */
  getUserSettings(channelId: ChannelId): Partial<UserSettings> | undefined {
    const res = this.#dao.get("userSettings");
    if (res === undefined) {
      return undefined;
    }
    if (channelId.id in res) {
      return res[channelId.id];
    } else {
      return undefined;
    }
  }

  /**
   * Set user settings to given channel id.
   *
   * given new user settings must be complete shape UserSettings.
   * old settings data will be completely rewrote.
   */
  registerUserSettings(channelId: ChannelId, settings: UserSettings) {
    const current = this.#dao.get("userSettings");
    if (current === undefined) {
      this.#dao.set("userSettings", { [channelId.id]: settings });
    } else {
      this.#dao.set("userSettings", { ...current, ...{ [channelId.id]: settings } });
    }
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
