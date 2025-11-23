import { ChannelId } from "youtube-live-scraper/dist/src";
import { FocusedOnChatItem } from "../ipcEvent";
import { LiveChatItemId } from "youtube-livechat-emitter/dist/src/core/LiveChatItemId";

export class FocusManager {
  #focusedItem: FocusedOnChatItem | undefined;
  constructor() {
    this.#focusedItem = undefined;
  }

  getFocus() {
    return this.#focusedItem;
  }

  updateFocus(item?: FocusedOnChatItem) {
    this.#focusedItem = item;
  }

  isFocused(itemId: LiveChatItemId) {
    return !this.#focusedItem ? false : this.#focusedItem.id.id === itemId.id;
  }

  isFocusedByAuthorChannelId(channelId: ChannelId) {
    return !this.#focusedItem ? false : this.#focusedItem.author.channelId.id === channelId.id;
  }
}
