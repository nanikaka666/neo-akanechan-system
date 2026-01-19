import { LiveLaunchProperties } from "../../types/liveLaunchProperties";
import { LiveStatistics } from "../../types/liveStatistics";
import {
  FirstMarkable,
  Focusable,
  FocusedOnChatItem,
  GiftReceived,
  MembershipAndGiftItem,
  MembershipGift,
  MembershipMilestone,
  MessageDeletedChatEvent,
  NewMembership,
  NonMarkedExtendedChatItemSuperChat,
  NonMarkedExtendedChatItemSuperSticker,
  NonMarkedExtendedChatItemText,
  Stockable,
  SuperChat,
  SuperSticker,
  TextMessageChat,
  UserBannedChatEvent,
} from "../../types/liveChatItem";
import { WebContents } from "electron";
import { WebContentsWrapper } from "../webContentsWrapper";
import { StockManager } from "../stock";
import { FocusManager } from "../focus";
import { getLiveStatisticsManager } from "../liveStatistics";
import { LiveChatDataFetcher } from "../liveManager/dataFetcher/liveChatDataFetcher";

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
  #membershipsAndGifts: MembershipAndGiftItem[];
  readonly #authorChannelIds = new Set<string>();
  readonly #webContents: WebContents;
  readonly #emitter: LiveChatDataFetcher;
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
    this.#emitter = new LiveChatDataFetcher(liveLaunchProperties.live.liveChatId);
    // this.#liveLaunchProperties = liveLaunchProperties;
    this.#stockManager = new StockManager();
    this.#focusManager = new FocusManager();
  }

  #onTextListener(item: TextMessageChat) {
    this.#textChatCount++;
    this.#textIndexOfWhole++;

    const convertedItem = {
      ...this.#checkIsFirstAndMark(item),
      ...{
        indexOfWhole: this.#textIndexOfWhole,
      },
    } satisfies NonMarkedExtendedChatItemText;
    this.#textChats = [...this.#textChats, convertedItem].slice(-1000); // take latest 1000 items.
    this.#refreshChatsOnRenderer();
    // console.log(item.displayMessage);
  }

  #onSuperChatListener(item: SuperChat) {
    const convertedItem = this.#checkIsFirstAndMark(item);
    this.#superChats = [...this.#superChats, convertedItem];
    this.#refreshChatsOnRenderer();
    console.log(item.displayMessage);
  }

  #onSuperStickerListener(item: SuperSticker) {
    console.log("SuperSticker comes.");
    console.log(item);
    const convertedItem = this.#checkIsFirstAndMark(item);
    this.#superChats = [...this.#superChats, convertedItem];

    this.#refreshChatsOnRenderer();
    console.log(item.displayMessage);
  }

  #onMessageDeletedListener(item: MessageDeletedChatEvent) {
    console.log("MessageDeleted comes.");
    console.log(item);
    // update textChatCount
    const matchSize = this.#textChats.filter((chat) => chat.id.id === item.id.id).length;
    this.#textChatCount -= matchSize;

    this.#textChats = this.#textChats.filter((chat) => chat.id.id !== item.id.id);
    console.log(`remove item: ${item.id.id}`);

    // if removed chat is stocked one, remove it.
    this.#stockManager.removeByIdIfNeeded(item.id);
    // removed chat from focus.
    if (this.#focusManager.isFocused(item.id)) {
      this.#focusManager.updateFocus(undefined);
    }

    this.#refreshChatsOnRenderer();
    console.log(item.displayMessage);
  }

  #onUserBannedListener(bannedItem: UserBannedChatEvent) {
    if (bannedItem.type === "userBannedTemporary") {
      return;
    }

    // hold a count which how many text chat will be removed.
    const countOfRemoveTextChat = this.#textChats.filter(
      (item) => item.author.channelId.id === bannedItem.bannedUser.channelId.id,
    ).length;

    this.#textChats = this.#textChats.filter(
      (item) => item.author.channelId.id !== bannedItem.bannedUser.channelId.id,
    );
    this.#superChats = this.#superChats.filter(
      (item) => item.author.channelId.id !== bannedItem.bannedUser.channelId.id,
    );
    console.log(`block user: ${bannedItem.bannedUser.channelId.id}`);

    this.#textChatCount -= countOfRemoveTextChat;
    this.#authorChannelIds.delete(bannedItem.bannedUser.channelId.id);
    this.#stockManager.removeByAuthorChannelIdIfNeeded(bannedItem.bannedUser.channelId);

    if (this.#focusManager.isFocusedByAuthorChannelId(bannedItem.bannedUser.channelId)) {
      this.#focusManager.updateFocus(undefined);
    }

    this.#refreshChatsOnRenderer();
    console.log(bannedItem.displayMessage);
  }

  #onNewMembershipListener(item: NewMembership) {
    this.#membershipsAndGifts = [...this.#membershipsAndGifts, item];
    this.#refreshMembershipsOnRenderer();
    console.log(item.displayMessage);
  }

  #onMembershipMilestoneListener(item: MembershipMilestone) {
    this.#membershipsAndGifts = [...this.#membershipsAndGifts, item];
    this.#refreshMembershipsOnRenderer();
    console.log(item.displayMessage);
  }

  #onMembershipGiftListener(item: MembershipGift) {
    this.#membershipsAndGifts = [...this.#membershipsAndGifts, item];
    this.#refreshMembershipsOnRenderer();
    console.log(item.displayMessage);
  }

  #onGiftReceivedListener(item: GiftReceived) {
    this.#membershipsAndGifts = [...this.#membershipsAndGifts, item];
    this.#refreshMembershipsOnRenderer();
    console.log(item.displayMessage);
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
      newMembershipsCount: this.#membershipsAndGifts.filter((item) => item.type === "newMembership")
        .length,
      membershipMilestoneCount: this.#membershipsAndGifts.filter(
        (item) => item.type === "milestone",
      ).length,
      giftCount: this.#membershipsAndGifts.filter((item) => item.type === "gift").length,
      redemptionGiftCount: this.#membershipsAndGifts.filter((item) => item.type === "giftReceived")
        .length,
    };

    getLiveStatisticsManager().updateLiveStatistics(latestStatistics);
  }

  setup() {
    this.#emitter.on("text", (item) => this.#onTextListener(item));
    this.#emitter.on("superChat", (item) => this.#onSuperChatListener(item));
    this.#emitter.on("superSticker", (item) => this.#onSuperStickerListener(item));
    this.#emitter.on("newSponsor", (item) => this.#onNewMembershipListener(item));
    this.#emitter.on("memberMilestoneChat", (item) => this.#onMembershipMilestoneListener(item));
    this.#emitter.on("membershipGifting", (item) => this.#onMembershipGiftListener(item));
    this.#emitter.on("giftMembershipReceived", (item) => this.#onGiftReceivedListener(item));
    this.#emitter.on("messageDeleted", (item) => this.#onMessageDeletedListener(item));
    this.#emitter.on("userBanned", (item) => this.#onUserBannedListener(item));

    this.#emitter.on("start", () => {
      console.log("LiveChatEmitter started.");
    });
    this.#emitter.on("end", (reason) => {
      console.log(`LiveChatEmitter finished by ${reason}`);
    });
    this.#emitter.on("error", (error) => {
      console.log(error);
    });
    this.#emitter.start();
  }

  cleanup() {
    this.#emitter.close();
  }

  #checkIsFirstAndMark<T extends TextMessageChat | SuperChat | SuperSticker>(
    item: T,
  ): T & FirstMarkable {
    const isFirstChat = !this.#authorChannelIds.has(item.author.channelId.id);
    if (isFirstChat) {
      this.#authorChannelIds.add(item.author.channelId.id);
    }
    return { ...item, isFirst: isFirstChat };
  }

  #markIsStocked<T extends NonMarkedExtendedChatItemText>(item: T): T & Stockable {
    return { ...item, isStocked: this.#stockManager.isStocked(item.id) };
  }

  #markIsFocused<
    T extends
      | NonMarkedExtendedChatItemText
      | NonMarkedExtendedChatItemSuperChat
      | NonMarkedExtendedChatItemSuperSticker,
  >(item: T): T & Focusable {
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

export function setupLiveChatEmitter(w: WebContents, liveLaunchProperties: LiveLaunchProperties) {
  if (liveChatManager) {
    liveChatManager.cleanup();
    liveChatManager = undefined;
  }
  liveChatManager = new LiveChatManager(liveLaunchProperties, w);
  liveChatManager.setup();
}

export function getLiveChatManager() {
  if (!liveChatManager) {
    throw new Error("LiveChatManager is not setup, call setupLiveChatEmitter()");
  }
  return liveChatManager;
}
