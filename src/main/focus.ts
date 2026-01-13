import { FocusedOnChatItem } from "../ipcEvent";
import { ChannelId, LiveChatItemId } from "./youtubeApi/model";

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
