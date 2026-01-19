import { WebContents } from "electron";
import { DataSource } from "../dataSource";
import { WebContentsWrapper } from "../../../main/webContentsWrapper";
import {
  NonMarkedExtendedChatItemText,
  Stockable,
  NonMarkedExtendedChatItemSuperChat,
  NonMarkedExtendedChatItemSuperSticker,
  Focusable,
} from "../../../types/liveChatItem";

export class LcpDataTransfer {
  readonly #webContents: WebContents;
  readonly #dataSource: DataSource;
  constructor(webContents: WebContents, dataSource: DataSource) {
    this.#webContents = webContents;
    this.#dataSource = dataSource;
  }
  syncLiveStatistics() {
    WebContentsWrapper.send(
      this.#webContents,
      "tellLiveStatistics",
      this.#dataSource.getLiveStatisticsDataContainer().get(),
    );
  }
  syncChats() {
    // text chats
    const markedTextChats = this.#dataSource
      .getChatDataManager()
      .getTexts()
      .map((item) => this.#markIsStocked(item))
      .map((item) => this.#markIsFocused(item));

    // super chat and stickers
    const markedSuperChatAndStickers = this.#dataSource
      .getChatDataManager()
      .getSuperChatAndStickers()
      .map((item) => this.#markIsFocused(item));

    // stocks
    const markedStocks = this.#dataSource
      .getStockManager()
      .getStocks()
      .map((item) => this.#markIsStocked(item))
      .map((item) => this.#markIsFocused(item));

    // Focus
    const currentFocus = this.#dataSource.getFocusManager().getFocus();
    const markedFocus = !currentFocus
      ? undefined
      : currentFocus.type === "text"
        ? this.#markIsFocused(this.#markIsStocked(currentFocus))
        : this.#markIsFocused(currentFocus);

    WebContentsWrapper.send(this.#webContents, "tellChats", {
      textChats: {
        items: markedTextChats,
        num: this.#dataSource.getChatDataManager().getTextChatCount(),
      },
      superChatAndStickers: markedSuperChatAndStickers,
      stocks: markedStocks,
      focus: markedFocus,
    });
  }

  syncMembershipAndGifts() {
    WebContentsWrapper.send(
      this.#webContents,
      "tellMembershipsAndGifts",
      this.#dataSource.getChatDataManager().getMembershipAndGifts(),
    );
  }

  #markIsStocked<T extends NonMarkedExtendedChatItemText>(item: T): T & Stockable {
    return { ...item, isStocked: this.#dataSource.getStockManager().isStocked(item.id) };
  }

  #markIsFocused<
    T extends
      | NonMarkedExtendedChatItemText
      | NonMarkedExtendedChatItemSuperChat
      | NonMarkedExtendedChatItemSuperSticker,
  >(item: T): T & Focusable {
    return { ...item, isFocused: this.#dataSource.getFocusManager().isFocused(item.id) };
  }
}
