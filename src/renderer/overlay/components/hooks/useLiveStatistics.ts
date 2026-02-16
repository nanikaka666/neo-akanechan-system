import { useEffect, useState } from "react";
import { LiveStatistics } from "../../../../types/liveStatistics";

const defaultStatistics: LiveStatistics = {
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

export function useLiveStatistics() {
  const [liveStatistics, setLiveStatistics] = useState<LiveStatistics>(defaultStatistics);
  useEffect(() => {
    const remover = window.ipcApi.registerLiveStatisticsListener((e, liveStatistics) => {
      setLiveStatistics((_) => liveStatistics);
    });
    return () => remover();
  }, []);

  return liveStatistics;
}
