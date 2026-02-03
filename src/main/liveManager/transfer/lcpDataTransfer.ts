import { DataSource } from "../dataSource";
import { WebContentsWrapper } from "../../../main/webContentsWrapper";
import {
  NonMarkedExtendedChatItemText,
  Stockable,
  NonMarkedExtendedChatItemSuperChat,
  NonMarkedExtendedChatItemSuperSticker,
  Focusable,
} from "../../../types/liveChatItem";
import { ParticipantPointRankingData, ParticipantPoint } from "../../../types/participantPoint";
import { getWindowManager } from "../../../main/window";

export class LcpDataTransfer {
  readonly #dataSource: DataSource;
  constructor(dataSource: DataSource) {
    this.#dataSource = dataSource;
  }
  syncLiveStatistics() {
    WebContentsWrapper.send(
      this.#getWebContents(),
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

    WebContentsWrapper.send(this.#getWebContents(), "tellChats", {
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
      this.#getWebContents(),
      "tellMembershipsAndGifts",
      this.#dataSource.getChatDataManager().getMembershipAndGifts(),
    );
  }

  syncRankings() {
    const items: ParticipantPointRankingData[] = Array.from(
      this.#dataSource.getParticipantManager().get().values(),
    )
      .sort(this.#rankingSortFunction)
      .slice(0, 100) // take top 100 rankings.
      .map((item, idx) => {
        return {
          rank: idx + 1,
          participantPoint: item,
        };
      });
    WebContentsWrapper.send(this.#getWebContents(), "tellRankings", {
      items: items,
      updatedAt: new Date(),
    });
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

  #rankingSortFunction(a: ParticipantPoint, b: ParticipantPoint) {
    return b.point === a.point
      ? a.participatedTime.getTime() - b.participatedTime.getTime()
      : b.point - a.point;
  }

  #getWebContents() {
    const res = getWindowManager().getMainWindowWebContents();
    if (res === undefined) {
      throw new Error("Data transfer failed by missing main window.");
    }
    return res;
  }
}
