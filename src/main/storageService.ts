import { ChannelId } from "youtube-live-scraper";
import { StorageDao } from "./storage";

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
