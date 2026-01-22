import {
  FocusedOnChatItem,
  GiftReceived,
  MembershipGift,
  MembershipMilestone,
  MessageDeletedChatEvent,
  NewMembership,
  NonMarkedExtendedChatItemText,
  SuperChat,
  SuperSticker,
  TextMessageChat,
  UserBannedChatEvent,
} from "../../../types/liveChatItem";
import { LiveLaunchProperties } from "../../../types/liveLaunchProperties";
import { DataSource } from "../dataSource";
import { LcpDataTransfer } from "../transfer/lcpDataTransfer";

export class Processor {
  readonly #liveLaunchProperties: LiveLaunchProperties;
  readonly #dataSource: DataSource;
  readonly #lcpDataTransfer: LcpDataTransfer;
  constructor(
    liveLaunchProperties: LiveLaunchProperties,
    dataSource: DataSource,
    lcpDataTransfer: LcpDataTransfer,
  ) {
    this.#liveLaunchProperties = liveLaunchProperties;
    this.#dataSource = dataSource;
    this.#lcpDataTransfer = lcpDataTransfer;
  }

  subscriberCount(nextSubscriberCount: number) {
    const { maxSubscriberCount } = this.#dataSource.getLiveStatisticsDataContainer().get();
    if (maxSubscriberCount < nextSubscriberCount) {
      // todo: max subscriber count is updated.
    }
    this.#dataSource.getLiveStatisticsDataContainer().update({
      currentSubscriberCount: nextSubscriberCount,
      maxSubscriberCount: Math.max(maxSubscriberCount, nextSubscriberCount),
    });
    this.#lcpDataTransfer.syncLiveStatistics();
  }

  likeCount(nextLikeCount: number) {
    const { maxLikeCount } = this.#dataSource.getLiveStatisticsDataContainer().get();
    if (maxLikeCount < nextLikeCount) {
      // todo: max like count is updated.
    }
    this.#dataSource.getLiveStatisticsDataContainer().update({
      currentLikeCount: nextLikeCount,
      maxLikeCount: Math.max(maxLikeCount, nextLikeCount),
    });
    this.#lcpDataTransfer.syncLiveStatistics();
  }

  viewerCount(nextViewerCount: number) {
    const { maxLiveViewCount } = this.#dataSource.getLiveStatisticsDataContainer().get();
    if (maxLiveViewCount < nextViewerCount) {
      // todo: max viewer count is updated.
    }
    this.#dataSource.getLiveStatisticsDataContainer().update({
      currentLiveViewCount: nextViewerCount,
      maxLiveViewCount: Math.max(maxLiveViewCount, nextViewerCount),
    });
    this.#lcpDataTransfer.syncLiveStatistics();
  }

  textChat(item: TextMessageChat) {
    const addedItem = this.#dataSource.getChatDataManager().addText(item);

    let addedAmountOfPoint = 0;
    addedAmountOfPoint += this.#dataSource.getParticipantManager().addByFirstChat(addedItem);
    addedAmountOfPoint += this.#dataSource.getParticipantManager().addByContinuousChat(addedItem);

    if (0 < addedAmountOfPoint) {
      this.#lcpDataTransfer.syncRankings();
    }

    this.#dataSource.getLiveStatisticsDataContainer().update({
      chatUUCount: this.#dataSource.getChatDataManager().getAuthorChannelIds().size,
      textChatCount: this.#dataSource.getChatDataManager().getTextChatCount(),
    });

    this.#lcpDataTransfer.syncLiveStatistics();
    this.#lcpDataTransfer.syncChats();
  }

  superChat(item: SuperChat) {
    const addedItem = this.#dataSource.getChatDataManager().addSuperChat(item);

    let addedAmountOfPoint = 0;
    addedAmountOfPoint += this.#dataSource.getParticipantManager().addByFirstChat(addedItem);
    addedAmountOfPoint += this.#dataSource.getParticipantManager().addByContinuousChat(addedItem);

    if (0 < addedAmountOfPoint) {
      this.#lcpDataTransfer.syncRankings();
    }

    this.#dataSource.getLiveStatisticsDataContainer().update({
      chatUUCount: this.#dataSource.getChatDataManager().getAuthorChannelIds().size,
      superChatCount: this.#dataSource
        .getChatDataManager()
        .getSuperChatAndStickers()
        .filter((chat) => chat.type === "superChat").length,
    });

    this.#lcpDataTransfer.syncLiveStatistics();
    this.#lcpDataTransfer.syncChats();
  }

  superSticker(item: SuperSticker) {
    console.log("SuperSticker: ", item);
    const addedItem = this.#dataSource.getChatDataManager().addSuperSticker(item);

    let addedAmountOfPoint = 0;
    addedAmountOfPoint += this.#dataSource.getParticipantManager().addByFirstChat(addedItem);
    addedAmountOfPoint += this.#dataSource.getParticipantManager().addByContinuousChat(addedItem);

    if (0 < addedAmountOfPoint) {
      this.#lcpDataTransfer.syncRankings();
    }

    this.#dataSource.getLiveStatisticsDataContainer().update({
      chatUUCount: this.#dataSource.getChatDataManager().getAuthorChannelIds().size,
      superStickerCount: this.#dataSource
        .getChatDataManager()
        .getSuperChatAndStickers()
        .filter((chat) => chat.type === "superSticker").length,
    });

    this.#lcpDataTransfer.syncLiveStatistics();
    this.#lcpDataTransfer.syncChats();
  }

  newMembership(item: NewMembership) {
    this.#dataSource.getChatDataManager().addNewMembership(item);

    if (0 < this.#dataSource.getParticipantManager().addByNewMembership(item)) {
      this.#lcpDataTransfer.syncRankings();
    }

    this.#dataSource.getLiveStatisticsDataContainer().update({
      newMembershipsCount: this.#dataSource
        .getChatDataManager()
        .getMembershipAndGifts()
        .filter((chat) => chat.type === "newMembership").length,
    });

    this.#lcpDataTransfer.syncLiveStatistics();
    this.#lcpDataTransfer.syncMembershipAndGifts();
  }

  membershipMilestone(item: MembershipMilestone) {
    this.#dataSource.getChatDataManager().addMembershipMilestone(item);

    if (0 < this.#dataSource.getParticipantManager().addByMembershipMilestone(item)) {
      this.#lcpDataTransfer.syncRankings();
    }

    this.#dataSource.getLiveStatisticsDataContainer().update({
      membershipMilestoneCount: this.#dataSource
        .getChatDataManager()
        .getMembershipAndGifts()
        .filter((chat) => chat.type === "milestone").length,
    });

    this.#lcpDataTransfer.syncLiveStatistics();
    this.#lcpDataTransfer.syncMembershipAndGifts();
  }

  membershipGift(item: MembershipGift) {
    this.#dataSource.getChatDataManager().addMembershipGift(item);
    this.#dataSource.getLiveStatisticsDataContainer().update({
      giftCount: this.#dataSource
        .getChatDataManager()
        .getMembershipAndGifts()
        .filter((chat) => chat.type === "gift").length,
    });

    this.#lcpDataTransfer.syncLiveStatistics();
    this.#lcpDataTransfer.syncMembershipAndGifts();
  }

  giftReceived(item: GiftReceived) {
    this.#dataSource.getChatDataManager().addGiftReceived(item);
    this.#dataSource.getLiveStatisticsDataContainer().update({
      redemptionGiftCount: this.#dataSource
        .getChatDataManager()
        .getMembershipAndGifts()
        .filter((chat) => chat.type === "giftReceived").length,
    });

    this.#lcpDataTransfer.syncLiveStatistics();
    this.#lcpDataTransfer.syncMembershipAndGifts();
  }

  messageDeleted(item: MessageDeletedChatEvent) {
    console.log("Message Deleted Event: ", item);
    this.#dataSource.getChatDataManager().deleteTextIfNeeded(item);
    this.#dataSource.getStockManager().removeByIdIfNeeded(item.deletedMessageId);
    this.#dataSource.getFocusManager().removeByIdIfNeeded(item.deletedMessageId);

    this.#dataSource.getLiveStatisticsDataContainer().update({
      textChatCount: this.#dataSource.getChatDataManager().getTextChatCount(),
      stocksCount: this.#dataSource.getStockManager().getStocks().length,
    });

    this.#lcpDataTransfer.syncLiveStatistics();
    this.#lcpDataTransfer.syncChats();
  }

  bannedUser(item: UserBannedChatEvent) {
    this.#dataSource.getChatDataManager().bannedUser(item);
    this.#dataSource.getStockManager().removeByAuthorChannelIdIfNeeded(item.bannedUser.channelId);
    this.#dataSource.getFocusManager().removeByAuthorIdIfNeeded(item.bannedUser.channelId);

    if (
      item.type === "userBannedEternal" &&
      this.#dataSource.getParticipantManager().disqualify(item.author)
    ) {
      this.#lcpDataTransfer.syncRankings();
    }

    this.#dataSource.getLiveStatisticsDataContainer().update({
      chatUUCount: this.#dataSource.getChatDataManager().getAuthorChannelIds().size,
      textChatCount: this.#dataSource.getChatDataManager().getTextChatCount(),
      superChatCount: this.#dataSource
        .getChatDataManager()
        .getSuperChatAndStickers()
        .filter((chat) => chat.type === "superChat").length,
      superStickerCount: this.#dataSource
        .getChatDataManager()
        .getSuperChatAndStickers()
        .filter((chat) => chat.type === "superSticker").length,
      stocksCount: this.#dataSource.getStockManager().getStocks().length,
    });

    this.#lcpDataTransfer.syncLiveStatistics();
    this.#lcpDataTransfer.syncChats();
  }

  addStock(item: NonMarkedExtendedChatItemText) {
    if (this.#dataSource.getStockManager().isStocked(item.id)) {
      return;
    }
    this.#dataSource.getStockManager().add(item);

    if (0 < this.#dataSource.getParticipantManager().addByStocked(item)) {
      this.#lcpDataTransfer.syncRankings();
    }

    this.#dataSource.getLiveStatisticsDataContainer().update({
      stocksCount: this.#dataSource.getStockManager().getStocks().length,
    });

    this.#lcpDataTransfer.syncLiveStatistics();
    this.#lcpDataTransfer.syncChats();
  }

  removeStock(item: NonMarkedExtendedChatItemText) {
    if (!this.#dataSource.getStockManager().isStocked(item.id)) {
      return;
    }
    this.#dataSource.getStockManager().remove(item);
    this.#dataSource.getLiveStatisticsDataContainer().update({
      stocksCount: this.#dataSource.getStockManager().getStocks().length,
    });

    this.#lcpDataTransfer.syncLiveStatistics();
    this.#lcpDataTransfer.syncChats();
  }

  setFocus(item: FocusedOnChatItem) {
    this.#dataSource.getFocusManager().updateFocus(item);
    this.#lcpDataTransfer.syncChats();

    if (0 < this.#dataSource.getParticipantManager().addByFocused(item)) {
      this.#lcpDataTransfer.syncRankings();
    }
  }

  unsetFocus() {
    if (this.#dataSource.getFocusManager().getFocus() === undefined) {
      return;
    }
    this.#dataSource.getFocusManager().updateFocus(undefined);

    this.#lcpDataTransfer.syncChats();
  }
}
