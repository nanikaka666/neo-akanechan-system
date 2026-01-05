import { LiveChatItemId } from "youtube-livechat-emitter/dist/src/core/LiveChatItemId";
import { NonMarkedExtendedChatItemText } from "../ipcEvent";
import { ChannelId } from "./youtubeApi/model";

export class StockManager {
  #stocks: NonMarkedExtendedChatItemText[];
  readonly #stockedItemIds: Set<string>;
  constructor() {
    this.#stocks = [];
    this.#stockedItemIds = new Set<string>();
  }

  getStocks() {
    return this.#stocks;
  }

  isStocked(itemId: LiveChatItemId) {
    return this.#stockedItemIds.has(itemId.id);
  }

  add(item: NonMarkedExtendedChatItemText) {
    if (this.isStocked(item.id)) {
      throw new Error(`this item is already stocked. ${item.id.id}`);
    }
    this.#stocks = [...this.#stocks, item];
    this.#stockedItemIds.add(item.id.id);
  }

  remove(item: NonMarkedExtendedChatItemText) {
    if (!this.isStocked(item.id)) {
      throw new Error(`this item is already unstocked. ${item.id.id}`);
    }
    this.#stocks = this.#stocks.filter((stock) => stock.id.id !== item.id.id);
    this.#stockedItemIds.delete(item.id.id);
  }

  removeByIdIfNeeded(itemId: LiveChatItemId) {
    const target = this.#stocks.filter((item) => item.id.id === itemId.id);
    if (target.length === 0) {
      return false;
    }
    this.remove(target[0]);
    return true;
  }

  removeByAuthorChannelIdIfNeeded(channelId: ChannelId) {
    const targets = this.#stocks.filter((item) => item.author.channelId.id === channelId.id);
    if (targets.length === 0) {
      return false;
    }

    targets.forEach(this.remove);
    return true;
  }
}
