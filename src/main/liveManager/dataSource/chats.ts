import {
  FirstMarkable,
  GiftReceived,
  MembershipAndGiftItem,
  MembershipGift,
  MembershipMilestone,
  MessageDeletedChatEvent,
  NewMembership,
  NonMarkedExtendedChatItemSuperChat,
  NonMarkedExtendedChatItemSuperSticker,
  NonMarkedExtendedChatItemText,
  SuperChat,
  SuperSticker,
  TextMessageChat,
  UserBannedChatEvent,
} from "../../../types/liveChatItem";

export class ChatDataManager {
  #texts: NonMarkedExtendedChatItemText[];

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

  #superChatAndStickers: (
    | NonMarkedExtendedChatItemSuperChat
    | NonMarkedExtendedChatItemSuperSticker
  )[];

  readonly #authorChannelIds: Set<string>;

  #membershipAndGifts: MembershipAndGiftItem[];

  constructor() {
    this.#texts = [];
    this.#textChatCount = 0;
    this.#textIndexOfWhole = 0;
    this.#superChatAndStickers = [];
    this.#authorChannelIds = new Set();
    this.#membershipAndGifts = [];
  }

  getTexts() {
    return this.#texts;
  }
  addText(item: TextMessageChat) {
    this.#textChatCount++;
    this.#textIndexOfWhole++;

    const nonMarkedItem = {
      ...this.#checkIsFirstAndMark(item),
      indexOfWhole: this.#textIndexOfWhole,
    } satisfies NonMarkedExtendedChatItemText;

    this.#texts = [...this.#texts, nonMarkedItem].slice(-1000); // take latest 1000 items.
    return nonMarkedItem;
  }
  deleteTextIfNeeded(item: MessageDeletedChatEvent) {
    const matchSize = this.#texts.filter((chat) => chat.id.id === item.id.id).length;
    if (0 < matchSize) {
      this.#textChatCount -= matchSize;
      this.#texts = this.#texts.filter((chat) => chat.id.id !== item.id.id);
    }
  }

  getTextChatCount() {
    return this.#textChatCount;
  }

  getTextIndexOfWhole() {
    return this.#textIndexOfWhole;
  }

  getSuperChatAndStickers() {
    return this.#superChatAndStickers;
  }
  addSuperChat(item: SuperChat) {
    const nonMarkedItem = this.#checkIsFirstAndMark(item);
    this.#superChatAndStickers = [...this.#superChatAndStickers, nonMarkedItem];
    return nonMarkedItem;
  }
  addSuperSticker(item: SuperSticker) {
    const nonMarkedItem = this.#checkIsFirstAndMark(item);
    this.#superChatAndStickers = [...this.#superChatAndStickers, nonMarkedItem];
    return nonMarkedItem;
  }

  getAuthorChannelIds() {
    return this.#authorChannelIds;
  }

  getMembershipAndGifts() {
    return this.#membershipAndGifts;
  }
  addNewMembership(item: NewMembership) {
    this.#membershipAndGifts = [...this.#membershipAndGifts, item];
  }
  addMembershipMilestone(item: MembershipMilestone) {
    this.#membershipAndGifts = [...this.#membershipAndGifts, item];
  }
  addMembershipGift(item: MembershipGift) {
    this.#membershipAndGifts = [...this.#membershipAndGifts, item];
  }
  addGiftReceived(item: GiftReceived) {
    this.#membershipAndGifts = [...this.#membershipAndGifts, item];
  }

  bannedUser(bannedItem: UserBannedChatEvent) {
    if (bannedItem.type === "userBannedTemporary") {
      return;
    }

    // hold a count which how many text chat will be removed.
    const countOfRemoveTextChat = this.#texts.filter(
      (item) => item.author.channelId.id === bannedItem.bannedUser.channelId.id,
    ).length;

    this.#texts = this.#texts.filter(
      (item) => item.author.channelId.id !== bannedItem.bannedUser.channelId.id,
    );
    this.#superChatAndStickers = this.#superChatAndStickers.filter(
      (item) => item.author.channelId.id !== bannedItem.bannedUser.channelId.id,
    );
    console.log(`block user: ${bannedItem.bannedUser.channelId.id}`);

    this.#textChatCount -= countOfRemoveTextChat;
    this.#authorChannelIds.delete(bannedItem.bannedUser.channelId.id);
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
}
