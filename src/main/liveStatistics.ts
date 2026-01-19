import { LiveStatistics } from "../types/liveStatistics";

export class LiveStatisticsDataContainer {
  #liveStatistics: LiveStatistics;
  constructor() {
    this.#liveStatistics = {
      currentLikeCount: 0,
      maxLikeCount: 0,
      currentLiveViewCount: 0,
      maxLiveViewCount: 0,
      textChatCount: 0,
      superChatCount: 0,
      superStickerCount: 0,
      chatUUCount: 0,
      currentSubscriberCount: 0,
      maxSubscriberCount: 0,
      newMembershipsCount: 0,
      membershipMilestoneCount: 0,
      giftCount: 0,
      redemptionGiftCount: 0,
      stocksCount: 0,
    };
  }

  get() {
    return this.#liveStatistics;
  }

  updateLiveStatistics(newData: Partial<LiveStatistics>) {
    this.#liveStatistics = { ...this.#liveStatistics, ...newData };
  }
}

let liveStatisticsManager: LiveStatisticsDataContainer | undefined;

export function getLiveStatisticsManager() {
  if (!liveStatisticsManager) {
    throw new Error("LiveStatisticsManager is not setup, call setupLiveStatistics().");
  }
  return liveStatisticsManager;
}
