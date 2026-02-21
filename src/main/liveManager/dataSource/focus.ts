import { FocusedOnChatItem } from "../../../types/liveChatItem";
import { ChannelId, LiveChatItemId } from "../../../types/youtubeDomainModel";

export type FocusStatus = FocusedStatus | UnfocusedStatus;

export interface FocusedStatus {
  type: "focused";
  item: FocusedOnChatItem;
  focusedAt: Date;
}

export interface UnfocusedStatus {
  type: "unfocused";
}

export class FocusManager {
  #focusedItem: FocusedOnChatItem | undefined;
  #focusedAt?: Date;
  constructor() {
    this.#focusedItem = undefined;
  }

  getFocusStatus(): FocusStatus {
    if (this.#focusedItem === undefined) {
      return { type: "unfocused" };
    } else {
      if (this.#focusedAt === undefined) {
        throw new Error("focusedAt is undefined.");
      }
      return {
        type: "focused",
        item: this.#focusedItem,
        focusedAt: this.#focusedAt,
      };
    }
  }

  getFocusedAt() {
    return this.#focusedAt;
  }

  updateFocus(item?: FocusedOnChatItem) {
    this.#focusedItem = item;
    if (item === undefined) {
      this.#focusedAt = undefined;
    } else {
      this.#focusedAt = new Date();
    }
  }

  isFocused(itemId: LiveChatItemId) {
    return !this.#focusedItem ? false : this.#focusedItem.id.id === itemId.id;
  }

  isFocusedByAuthorChannelId(channelId: ChannelId) {
    return !this.#focusedItem ? false : this.#focusedItem.author.channelId.id === channelId.id;
  }

  removeByIdIfNeeded(itemId: LiveChatItemId) {
    if (this.#focusedItem && this.#focusedItem.id.id === itemId.id) {
      this.#focusedItem = undefined;
    }
  }

  removeByAuthorIdIfNeeded(channelId: ChannelId) {
    if (this.#focusedItem && this.#focusedItem.author.channelId.id === channelId.id) {
      this.#focusedItem = undefined;
    }
  }
}
