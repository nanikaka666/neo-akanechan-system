import { ChannelId } from "youtube-live-scraper";
import { ElectronStoreClient } from "./electronStoreClient";

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
    const mainChannelId = ElectronStoreClient.get("mainChannelId");
    if (mainChannelId === undefined) {
      return undefined;
    } else {
      try {
        return new ChannelId(mainChannelId);
      } catch {
        // If process will be reached in here, stored data is broken. Delete it.
        ElectronStoreClient.delete("mainChannelId");
        return undefined;
      }
    }
  },

  /**
   * Add channel id to list and mark as main channel.
   *
   * Prerequisites: given channelId must be in Youtube ID style.
   */
  registerChannelIdAndMarkAsMain: (channelId: ChannelId) => {
    if (channelId.isHandle) {
      throw new Error(`Registering channelId must be Youtube ID style. ${channelId.id}`);
    }
    const list = ElectronStoreClient.get("registeredChannelIds") ?? [];

    // check it is already registered.
    if (list.filter((id) => id === channelId.id).length > 0) {
      return false;
    }
    const newList = [...list, channelId.id];
    ElectronStoreClient.set("registeredChannelIds", newList);
    ElectronStoreClient.set("mainChannelId", channelId.id);
    return true;
  },

  /**
   * Get whole object stored in storage.
   */
  getAll: () => {
    return ElectronStoreClient.getAll();
  },

  /**
   * Clear all storage data.
   */
  clearAll: () => {
    ElectronStoreClient.deleteAll();
  },
};
