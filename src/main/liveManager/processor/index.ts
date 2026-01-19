import {
  FirstMarkable,
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
    this.#dataSource.getChatDataManager().addText(item);

    this.#dataSource.getLiveStatisticsDataContainer().update({
      chatUUCount: this.#dataSource.getChatDataManager().getAuthorChannelIds().size,
      textChatCount: this.#dataSource.getChatDataManager().getTextChatCount(),
    });

    // todo: call data transfer
  }

  superChat(item: SuperChat) {
    this.#dataSource.getChatDataManager().addSuperChat(item);

    this.#dataSource.getLiveStatisticsDataContainer().update({
      chatUUCount: this.#dataSource.getChatDataManager().getAuthorChannelIds().size,
      superChatCount: this.#dataSource
        .getChatDataManager()
        .getSuperChatAndStickers()
        .filter((chat) => chat.type === "superChat").length,
    });

    // todo: call data transfer
  }

  superSticker(item: SuperSticker) {
    this.#dataSource.getChatDataManager().addSuperSticker(item);

    this.#dataSource.getLiveStatisticsDataContainer().update({
      chatUUCount: this.#dataSource.getChatDataManager().getAuthorChannelIds().size,
      superStickerCount: this.#dataSource
        .getChatDataManager()
        .getSuperChatAndStickers()
        .filter((chat) => chat.type === "superSticker").length,
    });

    // todo: call data transfer
  }

  newMembership(item: NewMembership) {
    this.#dataSource.getChatDataManager().addNewMembership(item);
    this.#dataSource.getLiveStatisticsDataContainer().update({
      newMembershipsCount: this.#dataSource
        .getChatDataManager()
        .getMembershipAndGifts()
        .filter((chat) => chat.type === "newMembership").length,
    });

    // todo: call data transfer
  }

  membershipMilestone(item: MembershipMilestone) {
    this.#dataSource.getChatDataManager().addMembershipMilestone(item);
    this.#dataSource.getLiveStatisticsDataContainer().update({
      membershipMilestoneCount: this.#dataSource
        .getChatDataManager()
        .getMembershipAndGifts()
        .filter((chat) => chat.type === "milestone").length,
    });

    // todo: call data transfer
  }

  membershipGift(item: MembershipGift) {
    this.#dataSource.getChatDataManager().addMembershipGift(item);
    this.#dataSource.getLiveStatisticsDataContainer().update({
      giftCount: this.#dataSource
        .getChatDataManager()
        .getMembershipAndGifts()
        .filter((chat) => chat.type === "gift").length,
    });

    // todo: call data transfer
  }

  giftReceived(item: GiftReceived) {
    this.#dataSource.getChatDataManager().addGiftReceived(item);
    this.#dataSource.getLiveStatisticsDataContainer().update({
      redemptionGiftCount: this.#dataSource
        .getChatDataManager()
        .getMembershipAndGifts()
        .filter((chat) => chat.type === "giftReceived").length,
    });

    // todo: call data transfer
  }

  messageDeleted(item: MessageDeletedChatEvent) {
    this.#dataSource.getChatDataManager().deleteTextIfNeeded(item);
    this.#dataSource.getStockManager().removeByIdIfNeeded(item.deletedMessageId);
    // todo: remove from focus

    this.#dataSource.getLiveStatisticsDataContainer().update({
      textChatCount: this.#dataSource.getChatDataManager().getTextChatCount(),
      stocksCount: this.#dataSource.getStockManager().getStocks().length,
    });

    // todo: call data transfer
  }

  bannedUser(item: UserBannedChatEvent) {
    this.#dataSource.getChatDataManager().bannedUser(item);
    this.#dataSource.getStockManager().removeByAuthorChannelIdIfNeeded(item.bannedUser.channelId);
    // todo: remove from focus

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

    // todo: call data transfer
  }
}
