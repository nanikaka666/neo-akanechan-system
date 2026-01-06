import {
  GiftRedemption,
  LiveChatItem,
  MembershipItem,
  SponsorshipsGift,
  TextMessage,
} from "youtube-livechat-emitter/dist/src/types/liveChat";
import {
  ExtendedGiftRedemption,
  ExtendedMembershipAndGiftItem,
  FocusedOnChatItem,
  LiveLaunchProperties,
  LiveStatistics,
  NonMarkedExtendedChatItemSuperChat,
  NonMarkedExtendedChatItemSuperSticker,
  NonMarkedExtendedChatItemText,
} from "../../ipcEvent";
import { YoutubeLiveChatEmitter } from "youtube-livechat-emitter";
import { WebContents } from "electron";
import { WebContentsWrapper } from "../webContentsWrapper";
import { StockManager } from "../stock";
import { FocusManager } from "../focus";
import { LiveChatItemId } from "youtube-livechat-emitter/dist/src/core/LiveChatItemId";
import { getLiveStatisticsManager } from "../liveStatistics";
import { ChannelId } from "../youtubeApi/model";

class LiveChatManager {
  #textChats: NonMarkedExtendedChatItemText[];

  /**
   * this variable holds counts of text chat actually.
   *
   * `#textChats.length` doesn't represent count of text chat, because `#textChats` will drop extra chat item when it's over 1,000.
   *
   * difference with `textIndexOfWhole` is that this is decremented when text chat is removed.
   */
  #textChatCount: number;

  /**
   * this variable holds count of coming text chat.
   *
   * it never decreased even if cause removing text chats.
   */
  #textIndexOfWhole: number;

  /**
   * including SuperChat and SuperSticker
   */
  #superChats: (NonMarkedExtendedChatItemSuperChat | NonMarkedExtendedChatItemSuperSticker)[];
  #membershipsAndGifts: ExtendedMembershipAndGiftItem[];
  readonly #authorChannelIds = new Set<string>();
  readonly #webContents: WebContents;
  // readonly #emitter: YoutubeLiveChatEmitter;
  // readonly #liveLaunchProperties: LiveLaunchProperties;
  readonly #stockManager: StockManager;
  readonly #focusManager: FocusManager;

  constructor(liveLaunchProperties: LiveLaunchProperties, webContents: WebContents) {
    this.#webContents = webContents;
    this.#textChats = [];
    this.#textChatCount = 0;
    this.#textIndexOfWhole = 0;
    this.#superChats = [];
    this.#membershipsAndGifts = [];
    this.#authorChannelIds = new Set<string>();
    // this.#emitter = new YoutubeLiveChatEmitter(
    //   liveLaunchProperties.channel.channel.channelId.id,
    //   1 * 1000,
    // );
    // this.#liveLaunchProperties = liveLaunchProperties;
    this.#stockManager = new StockManager();
    this.#focusManager = new FocusManager();
  }

  #onAddChatListener(item: LiveChatItem) {
    let isFirstChat = false;
    if (!this.#authorChannelIds.has(item.author.channelId.id)) {
      isFirstChat = true;
      this.#authorChannelIds.add(item.author.channelId.id);
    }
    if (item.type === "text") {
      this.#textChatCount++;
      this.#textIndexOfWhole++;

      const convertedItem = {
        ...item,
        ...{
          indexOfWhole: this.#textIndexOfWhole,
          formatedTime: this.#formatDate(item),
          isFirst: isFirstChat,
        },
      } satisfies NonMarkedExtendedChatItemText;
      this.#textChats = [...this.#textChats, convertedItem].slice(-1000); // take latest 1000 items.
      console.log(item.messages);
    } else if (item.type === "superChat") {
      const convertedItem = {
        ...item,
        ...{
          formatedTime: this.#formatDate(item),
          isFirst: isFirstChat,
        },
      } satisfies NonMarkedExtendedChatItemSuperChat;
      this.#superChats = [...this.#superChats, convertedItem];

      console.log(item.superChat);
    } else {
      const convertedItem = {
        ...item,
        ...{
          formatedTime: this.#formatDate(item),
          isFirst: isFirstChat,
        },
      } satisfies NonMarkedExtendedChatItemSuperSticker;
      this.#superChats = [...this.#superChats, convertedItem];
      console.log(item.superSticker);
    }
    this.#refreshChatsOnRenderer();
  }

  #onRemoveChatListener(itemId: LiveChatItemId) {
    // update textChatCount
    const matchSize = this.#textChats.filter((item) => item.id.id === itemId.id).length;
    this.#textChatCount -= matchSize;

    this.#textChats = this.#textChats.filter((item) => item.id.id !== itemId.id);
    console.log(`remove item: ${itemId.id}`);

    // if removed chat is stocked one, remove it.
    this.#stockManager.removeByIdIfNeeded(itemId);
    // removed chat from focus.
    if (this.#focusManager.isFocused(itemId)) {
      this.#focusManager.updateFocus(undefined);
    }

    this.#refreshChatsOnRenderer();
  }

  #onBlockUserListener(blockedChannelId: ChannelId) {
    // hold a count which how many text chat will be removed.
    const countOfRemoveTextChat = this.#textChats.filter(
      (item) => item.author.channelId.id === blockedChannelId.id,
    ).length;

    this.#textChats = this.#textChats.filter(
      (item) => item.author.channelId.id !== blockedChannelId.id,
    );
    this.#superChats = this.#superChats.filter(
      (item) => item.author.channelId.id !== blockedChannelId.id,
    );
    console.log(`block user: ${blockedChannelId.id}`);

    this.#textChatCount -= countOfRemoveTextChat;
    this.#authorChannelIds.delete(blockedChannelId.id);
    this.#stockManager.removeByAuthorChannelIdIfNeeded(blockedChannelId);

    if (this.#focusManager.isFocusedByAuthorChannelId(blockedChannelId)) {
      this.#focusManager.updateFocus(undefined);
    }

    this.#refreshChatsOnRenderer();
  }

  #onMembershipsListener(item: MembershipItem) {
    const convertedItem = {
      ...item,
      ...{ formatedTime: this.#formatDate(item) },
    } satisfies ExtendedMembershipAndGiftItem;
    this.#membershipsAndGifts = [...this.#membershipsAndGifts, convertedItem];
    this.#refreshMembershipsOnRenderer();

    if (item.type === "new") {
      console.log("New Memberships.", item);
    } else {
      console.log("Membership Milestone.", item);
    }
  }

  #onSponsorshipsGiftListener(item: SponsorshipsGift) {
    const message = (item.messages![0] as TextMessage).text;
    const res = message.match(/^[^0-9]*([0-9]+)/);
    if (res === null) {
      throw new Error(`Gift num not found. ${message}`);
    }
    const convertedItem = {
      ...item,
      type: "gift",
      num: Number.parseInt(res[1]),
      formatedTime: "???", // todo: livechat emitter update
      id: this.#membershipsAndGifts.length + "", // todo: given by emitter module
    } satisfies ExtendedMembershipAndGiftItem;

    this.#membershipsAndGifts = [...this.#membershipsAndGifts, convertedItem];
    this.#refreshMembershipsOnRenderer();
    console.log("Gift purchased!", convertedItem);
  }

  #onRedemptionGiftListener(item: GiftRedemption) {
    const convertedItem = {
      ...item,
      type: "redemption",
      formatedTime: this.#formatDate(item),
    } satisfies ExtendedGiftRedemption;
    this.#membershipsAndGifts = [...this.#membershipsAndGifts, convertedItem];
    this.#refreshMembershipsOnRenderer();
    console.log("Gift redemption!", convertedItem);
  }

  addStock(item: NonMarkedExtendedChatItemText) {
    if (this.#stockManager.isStocked(item.id)) {
      return false;
    }
    this.#stockManager.add(item);
    this.#refreshChatsOnRenderer();
    return true;
  }

  removeStock(item: NonMarkedExtendedChatItemText) {
    if (!this.#stockManager.isStocked(item.id)) {
      return false;
    }
    this.#stockManager.remove(item);
    this.#refreshChatsOnRenderer();
    return true;
  }

  updateFocus(item?: FocusedOnChatItem) {
    this.#focusManager.updateFocus(item);
    this.#refreshChatsOnRenderer();
  }

  /**
   * Reflect latest chat list (text, superchat, supersticker), stocks, focus and statistics to renderer.
   */
  #refreshChatsOnRenderer() {
    // text chats
    const markedTextChats = this.#textChats
      .map((item) => this.#markIsStocked(item))
      .map((item) => this.#markIsFocused(item));

    // super chat and stickers
    const markedSuperChatAndStickers = this.#superChats.map((item) => this.#markIsFocused(item));

    // stocks
    const markedStocks = this.#stockManager
      .getStocks()
      .map((item) => this.#markIsStocked(item))
      .map((item) => this.#markIsFocused(item));

    // Focus
    const currentFocus = this.#focusManager.getFocus();
    const markedFocus = !currentFocus
      ? undefined
      : currentFocus.type === "text"
        ? this.#markIsFocused(this.#markIsStocked(currentFocus))
        : this.#markIsFocused(currentFocus);

    WebContentsWrapper.send(this.#webContents, "tellChats", {
      textChats: {
        items: markedTextChats,
        num: this.#textChatCount,
      },
      superChatAndStickers: markedSuperChatAndStickers,
      stocks: markedStocks,
      focus: markedFocus,
    });

    // statistics
    const latestStatistics: Pick<
      LiveStatistics,
      "chatUUCount" | "textChatCount" | "superChatCount" | "superStickerCount" | "stocksCount" // todo: add focus
    > = {
      chatUUCount: this.#authorChannelIds.size,
      textChatCount: this.#textChatCount,
      superChatCount: this.#superChats.filter((chat) => chat.type === "superChat").length,
      superStickerCount: this.#superChats.filter((chat) => chat.type === "superSticker").length,
      stocksCount: this.#stockManager.getStocks().length,
    };

    getLiveStatisticsManager().updateLiveStatistics(latestStatistics);
  }

  #refreshMembershipsOnRenderer() {
    WebContentsWrapper.send(
      this.#webContents,
      "tellMembershipsAndGifts",
      this.#membershipsAndGifts,
    );

    // statistics
    const latestStatistics: Pick<
      LiveStatistics,
      "newMembershipsCount" | "membershipMilestoneCount" | "giftCount" | "redemptionGiftCount"
    > = {
      newMembershipsCount: this.#membershipsAndGifts.filter((item) => item.type === "new").length,
      membershipMilestoneCount: this.#membershipsAndGifts.filter(
        (item) => item.type === "milestone",
      ).length,
      giftCount: this.#membershipsAndGifts.filter((item) => item.type === "gift").length,
      redemptionGiftCount: this.#membershipsAndGifts.filter((item) => item.type === "redemption")
        .length,
    };

    getLiveStatisticsManager().updateLiveStatistics(latestStatistics);
  }

  async setup() {
    // this.#emitter.on("addChat", (item) => this.#onAddChatListener(item));
    // this.#emitter.on("removeChat", (id) => this.#onRemoveChatListener(id));
    // this.#emitter.on("blockUser", (channelId) => this.#onBlockUserListener(channelId));
    // this.#emitter.on("memberships", (item) => this.#onMembershipsListener(item));
    // this.#emitter.on("sponsorshipsGift", (item) => this.#onSponsorshipsGiftListener(item));
    // this.#emitter.on("redemptionGift", (item) => this.#onRedemptionGiftListener(item));
    // this.#emitter.on("start", () => {
    //   console.log("LiveChatEmitter started.");
    // });
    // this.#emitter.on("end", () => {
    //   console.log("LiveChatEmitter finished.");
    // });
    // this.#emitter.on("error", (error) => {
    //   console.log(error);
    // });
    // await this.#emitter.start();
  }

  cleanup() {
    // this.#emitter.close();
  }

  // todo: accept SponsorshipGift
  #formatDate(item: LiveChatItem | MembershipItem | GiftRedemption) {
    const date = new Date(item.timestamp / 1000); // microsecond to millisecond

    const hour = date.getHours() + "";
    const minute = date.getMinutes() + "";
    const second = date.getSeconds() + "";

    return `${this.#to2Digit(hour)}:${this.#to2Digit(minute)}:${this.#to2Digit(second)}`;
  }

  #to2Digit(value: string) {
    return value.length === 1 ? "0" + value : value;
  }

  #markIsStocked<T extends NonMarkedExtendedChatItemText>(item: T): T & { isStocked: boolean } {
    return { ...item, isStocked: this.#stockManager.isStocked(item.id) };
  }

  #markIsFocused<
    T extends
      | NonMarkedExtendedChatItemText
      | NonMarkedExtendedChatItemSuperChat
      | NonMarkedExtendedChatItemSuperSticker,
  >(item: T): T & { isFocused: boolean } {
    return { ...item, isFocused: this.#focusManager.isFocused(item.id) };
  }
}

let liveChatManager: LiveChatManager | undefined;

export function cleanUpLiveChatEmitter() {
  if (!liveChatManager) {
    return;
  }
  liveChatManager.cleanup();
  liveChatManager = undefined;
}

export async function setupLiveChatEmitter(
  w: WebContents,
  liveLaunchProperties: LiveLaunchProperties,
) {
  if (liveChatManager) {
    liveChatManager.cleanup();
    liveChatManager = undefined;
  }
  liveChatManager = new LiveChatManager(liveLaunchProperties, w);
  await liveChatManager.setup();
}

export function getLiveChatManager() {
  if (!liveChatManager) {
    throw new Error("LiveChatManager is not setup, call setupLiveChatEmitter()");
  }
  return liveChatManager;
}
