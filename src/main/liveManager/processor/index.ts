import { PariticipantPointRankings } from "../../../types/participantPoint";
import { Announcement } from "../../../types/announcement";
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
import { DataSource } from "../dataSource";
import { LcpDataTransfer } from "../transfer/lcpDataTransfer";
import { OverlayDataTransfer } from "../transfer/overlayDataTransfer";
import { OptionLabel } from "../../../types/competition";
import { parseChatCommand } from "./chatCommand";
import { JoinCompetitionCommand } from "../../../types/chatCommand";

export class Processor {
  readonly #dataSource: DataSource;
  readonly #lcpDataTransfer: LcpDataTransfer;
  readonly #overlayDataTransfer: OverlayDataTransfer;
  constructor(
    dataSource: DataSource,
    lcpDataTransfer: LcpDataTransfer,
    overlayDataTransfer: OverlayDataTransfer,
  ) {
    this.#dataSource = dataSource;
    this.#lcpDataTransfer = lcpDataTransfer;
    this.#overlayDataTransfer = overlayDataTransfer;
  }

  subscriberCount(nextSubscriberCount: number) {
    const { maxSubscriberCount } = this.#dataSource.getLiveStatisticsDataContainer().get();
    const { isSubscriberCountGoalAccomplished } = this.#dataSource.getGoalsManager().get();
    if (!isSubscriberCountGoalAccomplished) {
      const { subscriberCountGoal } = this.#dataSource.getLiveSettingsManager().get();
      if (subscriberCountGoal <= maxSubscriberCount) {
        this.#dataSource.getGoalsManager().accomplishSubscriberCountGoal();
        this.#lcpDataTransfer.syncAllGoalStatus();
        const list = this.#dataSource.getParticipantManager().addBySubscriberGoalAccomplished();
        this.#overlayDataTransfer.sendOverlayEvent({
          type: "subscriberCountGoalAchivement",
          points: list,
          announcement: {
            type: "subscriberCountGoalAccomplished",
            logId: crypto.randomUUID(),
            goalValue: subscriberCountGoal,
          },
        });
        this.#lcpDataTransfer.syncRankings();
      }
    }
    this.#dataSource.getLiveStatisticsDataContainer().update({
      currentSubscriberCount: nextSubscriberCount,
      maxSubscriberCount: Math.max(maxSubscriberCount, nextSubscriberCount),
    });
    this.#syncLiveStatistics();
  }

  likeCount(nextLikeCount: number) {
    // check likeCountGoals is promoted.
    const { maxLikeCount } = this.#dataSource.getLiveStatisticsDataContainer().get();
    const likeCountStatus = this.#dataSource.getGoalsManager().get().likeCountStatus;
    if (likeCountStatus.type === "inProgress") {
      const likeCountGoal = this.#dataSource.getLiveSettingsManager().get().likeCountGoal;
      const nextGoalValue = likeCountGoal.goalValues[likeCountStatus.currentLevel];
      if (nextGoalValue <= maxLikeCount) {
        this.#dataSource.getGoalsManager().promotionLikeCount();
        this.#lcpDataTransfer.syncAllGoalStatus();
        const addedPointLists = this.#dataSource
          .getParticipantManager()
          .addByGoalsPromotion(
            likeCountStatus.currentLevel,
            nextGoalValue,
            likeCountGoal.maxLevel,
            this.#calcPassedHour(),
          );
        this.#lcpDataTransfer.syncRankings();
        const appLog: Announcement =
          likeCountStatus.currentLevel === likeCountGoal.maxLevel
            ? {
                type: "likeCountGoalAccomplished",
                logId: crypto.randomUUID(),
                goalValue: nextGoalValue,
              }
            : {
                type: "likeCountGoalPromotion",
                logId: crypto.randomUUID(),
                goalValue: nextGoalValue,
                level: likeCountStatus.currentLevel,
              };
        this.#overlayDataTransfer.sendOverlayEvent({
          type: "likeCountLevelPromotion",
          points: addedPointLists,
          announcement: appLog,
        });
      }
    }

    // update LiveStatistics
    this.#dataSource.getLiveStatisticsDataContainer().update({
      currentLikeCount: nextLikeCount,
      maxLikeCount: Math.max(maxLikeCount, nextLikeCount),
    });
    this.#syncLiveStatistics();
  }

  viewerCount(nextViewerCount: number) {
    const { maxLiveViewCount } = this.#dataSource.getLiveStatisticsDataContainer().get();
    const viewerCountStatus = this.#dataSource.getGoalsManager().get().viewerCountStatus;
    if (viewerCountStatus.type === "inProgress") {
      const viewerCountGoal = this.#dataSource.getLiveSettingsManager().get().viewerCountGoal;
      const nextGoalValue = viewerCountGoal.goalValues[viewerCountStatus.currentLevel];
      if (nextGoalValue <= maxLiveViewCount) {
        this.#dataSource.getGoalsManager().promotionViewerCount();
        this.#lcpDataTransfer.syncAllGoalStatus();
        const addedPointLists = this.#dataSource
          .getParticipantManager()
          .addByGoalsPromotion(
            viewerCountStatus.currentLevel,
            nextGoalValue,
            viewerCountGoal.maxLevel,
            this.#calcPassedHour(),
          );
        this.#lcpDataTransfer.syncRankings();
        const appLog: Announcement =
          viewerCountStatus.currentLevel === viewerCountGoal.maxLevel
            ? {
                type: "viewerCountGoalAccomplished",
                logId: crypto.randomUUID(),
                goalValue: nextGoalValue,
              }
            : {
                type: "viewerCountGoalPromotion",
                logId: crypto.randomUUID(),
                goalValue: nextGoalValue,
                level: viewerCountStatus.currentLevel,
              };
        this.#overlayDataTransfer.sendOverlayEvent({
          type: "viewerCountLevelPromotion",
          points: addedPointLists,
          announcement: appLog,
        });
      }
    }
    this.#dataSource.getLiveStatisticsDataContainer().update({
      currentLiveViewCount: nextViewerCount,
      maxLiveViewCount: Math.max(maxLiveViewCount, nextViewerCount),
    });
    this.#syncLiveStatistics();
  }

  actualStartTime(actualStartTime: Date) {
    this.#dataSource.getLiveStatisticsDataContainer().update({
      actualStartTime: actualStartTime,
    });
    this.#syncLiveStatistics();
  }

  textChat(item: TextMessageChat) {
    const addedItem = this.#dataSource.getChatDataManager().addText(item);

    let addedAmountOfPoint = 0;
    addedAmountOfPoint += this.#dataSource.getParticipantManager().addByFirstChat(addedItem);
    addedAmountOfPoint += this.#dataSource.getParticipantManager().addByContinuousChat(addedItem);

    if (0 < addedAmountOfPoint) {
      this.#lcpDataTransfer.syncRankings();
      this.#overlayDataTransfer.sendAmountOfPoint(item.author, addedAmountOfPoint);
    }

    // call deal command after adding point.
    // to avoid betting with 0 points.
    this.#dealChatCommand(item);

    this.#dataSource.getLiveStatisticsDataContainer().update({
      chatUUCount: this.#dataSource.getChatDataManager().getAuthorChannelIds().size,
      textChatCount: this.#dataSource.getChatDataManager().getTextChatCount(),
    });

    this.#syncLiveStatistics();
    this.#lcpDataTransfer.syncChats();
    this.#overlayDataTransfer.sendChatLog(item);
  }

  superChat(item: SuperChat) {
    const addedItem = this.#dataSource.getChatDataManager().addSuperChat(item);

    let addedAmountOfPoint = 0;
    addedAmountOfPoint += this.#dataSource.getParticipantManager().addByFirstChat(addedItem);
    addedAmountOfPoint += this.#dataSource.getParticipantManager().addByContinuousChat(addedItem);

    if (0 < addedAmountOfPoint) {
      this.#lcpDataTransfer.syncRankings();
      this.#overlayDataTransfer.sendAmountOfPoint(item.author, addedAmountOfPoint);
    }

    this.#dataSource.getLiveStatisticsDataContainer().update({
      chatUUCount: this.#dataSource.getChatDataManager().getAuthorChannelIds().size,
      superChatCount: this.#dataSource
        .getChatDataManager()
        .getSuperChatAndStickers()
        .filter((chat) => chat.type === "superChat").length,
    });

    this.#syncLiveStatistics();
    this.#lcpDataTransfer.syncChats();
    this.#overlayDataTransfer.sendChatLog(item);
  }

  superSticker(item: SuperSticker) {
    console.log("SuperSticker: ", item);
    const addedItem = this.#dataSource.getChatDataManager().addSuperSticker(item);

    let addedAmountOfPoint = 0;
    addedAmountOfPoint += this.#dataSource.getParticipantManager().addByFirstChat(addedItem);
    addedAmountOfPoint += this.#dataSource.getParticipantManager().addByContinuousChat(addedItem);

    if (0 < addedAmountOfPoint) {
      this.#lcpDataTransfer.syncRankings();
      this.#overlayDataTransfer.sendAmountOfPoint(item.author, addedAmountOfPoint);
    }

    this.#dataSource.getLiveStatisticsDataContainer().update({
      chatUUCount: this.#dataSource.getChatDataManager().getAuthorChannelIds().size,
      superStickerCount: this.#dataSource
        .getChatDataManager()
        .getSuperChatAndStickers()
        .filter((chat) => chat.type === "superSticker").length,
    });

    this.#syncLiveStatistics();
    this.#lcpDataTransfer.syncChats();
    this.#overlayDataTransfer.sendChatLog(item);
  }

  newMembership(item: NewMembership) {
    this.#dataSource.getChatDataManager().addNewMembership(item);

    const addedAmountOfPoint = this.#dataSource.getParticipantManager().addByNewMembership(item);

    if (0 < addedAmountOfPoint) {
      this.#lcpDataTransfer.syncRankings();
      this.#overlayDataTransfer.sendAmountOfPoint(item.author, addedAmountOfPoint);
    }

    this.#dataSource.getLiveStatisticsDataContainer().update({
      newMembershipsCount: this.#dataSource
        .getChatDataManager()
        .getMembershipAndGifts()
        .filter((chat) => chat.type === "newMembership").length,
    });

    this.#syncLiveStatistics();
    this.#lcpDataTransfer.syncMembershipAndGifts();
    this.#overlayDataTransfer.sendChatLog(item);
  }

  membershipMilestone(item: MembershipMilestone) {
    this.#dataSource.getChatDataManager().addMembershipMilestone(item);

    const addedAmountOfPoint = this.#dataSource
      .getParticipantManager()
      .addByMembershipMilestone(item);

    if (0 < addedAmountOfPoint) {
      this.#lcpDataTransfer.syncRankings();
      this.#overlayDataTransfer.sendAmountOfPoint(item.author, addedAmountOfPoint);
    }

    this.#dataSource.getLiveStatisticsDataContainer().update({
      membershipMilestoneCount: this.#dataSource
        .getChatDataManager()
        .getMembershipAndGifts()
        .filter((chat) => chat.type === "milestone").length,
    });

    this.#syncLiveStatistics();
    this.#lcpDataTransfer.syncMembershipAndGifts();
    this.#overlayDataTransfer.sendChatLog(item);
  }

  membershipGift(item: MembershipGift) {
    this.#dataSource.getChatDataManager().addMembershipGift(item);

    const addedAmountOfPoint = this.#dataSource.getParticipantManager().addByMembershipGift(item);

    if (0 < addedAmountOfPoint) {
      this.#lcpDataTransfer.syncRankings();
      this.#overlayDataTransfer.sendAmountOfPoint(item.author, addedAmountOfPoint);
    }

    this.#dataSource.getLiveStatisticsDataContainer().update({
      giftCount: this.#dataSource
        .getChatDataManager()
        .getMembershipAndGifts()
        .filter((chat) => chat.type === "gift").length,
    });

    this.#syncLiveStatistics();
    this.#lcpDataTransfer.syncMembershipAndGifts();
    this.#overlayDataTransfer.sendChatLog(item);
  }

  giftReceived(item: GiftReceived) {
    this.#dataSource.getChatDataManager().addGiftReceived(item);
    this.#dataSource.getLiveStatisticsDataContainer().update({
      redemptionGiftCount: this.#dataSource
        .getChatDataManager()
        .getMembershipAndGifts()
        .filter((chat) => chat.type === "giftReceived").length,
    });

    this.#syncLiveStatistics();
    this.#lcpDataTransfer.syncMembershipAndGifts();
    this.#overlayDataTransfer.sendChatLog(item);
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

    this.#syncLiveStatistics();
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

    this.#syncLiveStatistics();
    this.#lcpDataTransfer.syncChats();
  }

  addStock(item: NonMarkedExtendedChatItemText) {
    if (this.#dataSource.getStockManager().isStocked(item.id)) {
      return;
    }
    this.#dataSource.getStockManager().add(item);

    const addedAmountOfPoint = this.#dataSource.getParticipantManager().addByStocked(item);

    if (0 < addedAmountOfPoint) {
      this.#lcpDataTransfer.syncRankings();
      this.#overlayDataTransfer.sendAmountOfPoint(item.author, addedAmountOfPoint);
    }

    this.#dataSource.getLiveStatisticsDataContainer().update({
      stocksCount: this.#dataSource.getStockManager().getStocks().length,
    });

    this.#syncLiveStatistics();
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

    this.#syncLiveStatistics();
    this.#lcpDataTransfer.syncChats();
  }

  setFocus(item: FocusedOnChatItem) {
    this.#addPointFocus();

    this.#dataSource.getFocusManager().updateFocus(item);
    this.#lcpDataTransfer.syncChats();

    this.#overlayDataTransfer.syncFocusView();
  }

  unsetFocus() {
    const focusStatus = this.#dataSource.getFocusManager().getFocusStatus();
    if (focusStatus.type === "unfocused") {
      return;
    }
    this.#addPointFocus();

    this.#dataSource.getFocusManager().updateFocus(undefined);

    this.#lcpDataTransfer.syncChats();
    this.#overlayDataTransfer.syncFocusView();
  }

  showRanking(ranking: PariticipantPointRankings) {
    this.#dataSource.getShowRankingManager().updateRanking(ranking);
    this.#overlayDataTransfer.syncRanking();
    this.#lcpDataTransfer.syncIsShownRanking();
  }

  hideRanking() {
    this.#dataSource.getShowRankingManager().hideRanking();
    this.#overlayDataTransfer.syncRanking();
    this.#lcpDataTransfer.syncIsShownRanking();
  }

  openCompetition(question: string, options: string[], acceptTimeMinutes: number) {
    this.#dataSource
      .getCompetitionManager()
      .openCompetition(question, options, acceptTimeMinutes, () => {
        this.#syncCompetitionStatus();
      });

    this.#syncCompetitionStatus();
  }

  abortCompetition() {
    this.#dataSource.getCompetitionManager().close();
    this.#syncCompetitionStatus();
  }

  answerDecision(answer: OptionLabel) {
    const status = this.#dataSource.getCompetitionManager().get();
    if (status.type !== "entryClosed") {
      return;
    }

    const allBets = this.#dataSource.getCompetitionManager().getBets();
    this.#dataSource.getCompetitionManager().answerDecision(answer);
    this.#syncCompetitionStatus();

    const optionStats = status.statistics.options.get(answer);
    if (optionStats === undefined) {
      throw new Error(`Competition statistics not found by key: ${answer}`);
    }

    // all users joined to competition pay the stake.
    this.#dataSource.getParticipantManager().subtractByCompetitionStake(allBets);

    // winners got points.
    const list = this.#dataSource.getParticipantManager().addByCompetition(
      allBets.filter((bet) => bet.betTo === answer),
      status.statistics.all,
      optionStats,
    );

    this.#lcpDataTransfer.syncRankings();

    this.#overlayDataTransfer.sendOverlayEvent({
      type: "competitionPayout",
      points: list,
      announcement: {
        type: "competitionPayout",
        logId: status.settings.competitionId,
        answer: answer,
        optionStr: status.settings.options.get(answer)!,
        betCount: optionStats.betCount,
      },
    });

    this.#dataSource.getCompetitionManager().close();
    this.#syncCompetitionStatus();
  }

  manuallyEntryClose() {
    this.#dataSource.getCompetitionManager().manuallyEntryClose();
    this.#syncCompetitionStatus();
  }

  syncLiveSettings() {
    this.#overlayDataTransfer.syncLiveSettings();
  }

  updateLiveSettings() {
    this.#dataSource.getLiveSettingsManager().update();
    this.#lcpDataTransfer.syncLiveSettings();
    this.#overlayDataTransfer.syncLiveSettings();
  }

  /**
   * Sync LiveStatistics both windows.
   */
  #syncLiveStatistics() {
    this.#lcpDataTransfer.syncLiveStatistics();
    this.#overlayDataTransfer.syncLiveStatistics();
  }

  #syncCompetitionStatus() {
    this.#lcpDataTransfer.syncCompetitionStatus();
    this.#overlayDataTransfer.syncCompetitionStatus();
  }

  #calcPassedHour() {
    const maybeActualStartTime = this.#dataSource
      .getLiveStatisticsDataContainer()
      .get().actualStartTime;
    if (maybeActualStartTime === undefined) {
      return 0;
    }
    const diffSeconds = (new Date().getTime() - maybeActualStartTime.getTime()) / 1000;
    return Math.floor(diffSeconds / 3600);
  }

  #addPointFocus() {
    const focusStatus = this.#dataSource.getFocusManager().getFocusStatus();
    if (focusStatus.type === "unfocused") {
      return;
    }
    const addedAmountOfPoint = this.#dataSource
      .getParticipantManager()
      .addByFocused(focusStatus.item, focusStatus.focusedAt);

    if (0 < addedAmountOfPoint) {
      this.#lcpDataTransfer.syncRankings();
      this.#overlayDataTransfer.sendAmountOfPoint(focusStatus.item.author, addedAmountOfPoint);
    }
  }

  #dealChatCommand(text: TextMessageChat) {
    const maybeCommand = parseChatCommand(text);
    if (maybeCommand === undefined) {
      return;
    }

    if (maybeCommand.type === "joinCompetition") {
      this.#dealJoinCompetitionCommand(maybeCommand, text);
    }
  }

  #dealJoinCompetitionCommand(command: JoinCompetitionCommand, text: TextMessageChat) {
    const status = this.#dataSource.getCompetitionManager().get();
    if (status.type === "notHeld" || status.type === "answerDecided") {
      return;
    }

    // check betTo validity.
    if (!status.settings.options.has(command.betTo)) {
      return;
    }

    const participantPoint = this.#dataSource
      .getParticipantManager()
      .get()
      .get(text.author.channelId.id);

    if (participantPoint) {
      // if user has less than 100 points then it is dealt as 100 points.
      const stake = Math.max(100, participantPoint.point);

      this.#dataSource
        .getCompetitionManager()
        .bet(text.author, command.betTo, stake, text.publishedAt);

      this.#syncCompetitionStatus();
    }
  }
}
