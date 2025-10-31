import { ChannelId } from "youtube-live-scraper";
import { StorageDao } from "./types";
import { UserSettings } from "../userSettings";

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
    if (channelId.isHandle) {
      throw new Error(`Registering channelId must be Youtube ID style. ${channelId.id}`);
    }
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
    if (channelId.isHandle) {
      throw new Error(`Registering channelId must be Youtube ID style. ${channelId.id}`);
    }
    const list = this.#dao.get("registeredChannelIds") ?? [];

    // check: channelId is registered.
    if (list.filter((id) => id === channelId.id).length === 0) {
      return false;
    }
    this.#dao.set("mainChannelId", channelId.id);
    return true;
  }

  /**
   * Get user settings attached to given channel id.
   *
   * if no settings, `undefined` will be returned.
   * this function return *Partial* UserSettings because StorageData has possibility changing structure.
   */
  getUserSettings(channelId: ChannelId): Partial<UserSettings> | undefined {
    if (channelId.isHandle) {
      throw new Error(`ChannelId must be Youtube ID style. ${channelId.id}`);
    }
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
    if (channelId.isHandle) {
      throw new Error(`ChannelId must be Youtube ID style. ${channelId.id}`);
    }
    const current = this.#dao.get("userSettings");
    if (current === undefined) {
      this.#dao.set("userSettings", { [channelId.id]: settings });
    } else {
      this.#dao.set("userSettings", { ...current, ...{ [channelId.id]: settings } });
    }
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
