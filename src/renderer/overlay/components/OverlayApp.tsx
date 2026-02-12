import { CarouselManager } from "./CarouselManager";
import { Clock } from "./Clock";
import { PoppingManager } from "./PoppingManager";
import { LikeCountIndicator } from "./LikeCountIndicator";
import { ViewerCountIndicator } from "./ViewerCountIndicator";
import { SubscriberCountIndicator } from "./SubscriberCountIndicator";
import { useEffect, useState } from "react";
import { LiveSettings } from "../../../types/liveSettings";
import { LiveStatistics } from "../../../types/liveStatistics";

export function OverlayApp() {
  const [liveSettings, setLiveSettings] = useState<LiveSettings>();
  const [liveStatistics, setLiveStatistics] = useState<LiveStatistics>({
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
  });
  useEffect(() => {
    const liveSettingsListenerRemover = window.ipcApi.registerLiveSettingsListener(
      (e, liveSettings) => {
        setLiveSettings((_) => liveSettings);
      },
    );
    window.ipcApi.requestSyncLiveSettings();
    const liveStatisticsListenerRemover = window.ipcApi.registerLiveStatisticsListener(
      (e, liveStatistics) => {
        setLiveStatistics((_) => liveStatistics);
      },
    );
    return () => {
      liveSettingsListenerRemover();
      liveStatisticsListenerRemover();
    };
  }, []);

  return (
    <div>
      <PoppingManager />
      {liveSettings && (
        <CarouselManager
          items={[
            <LikeCountIndicator
              key={1}
              gaugeLevel={1}
              goal={liveSettings.likeCountGoal}
              currentValue={liveStatistics.currentLikeCount}
              maxValueSoFar={liveStatistics.maxLikeCount}
            />,
            <ViewerCountIndicator
              key={2}
              gaugeLevel={3}
              goal={liveSettings.viewerCountGoal}
              currentValue={liveStatistics.currentLiveViewCount}
              maxValueSoFar={liveStatistics.maxLiveViewCount}
            />,
            <SubscriberCountIndicator
              key={3}
              goalValue={liveSettings.subscriberCountGoal}
              currentValue={liveStatistics.currentSubscriberCount}
              maxValueSoFar={liveStatistics.maxSubscriberCount}
            />,
            <Clock key={4} />,
          ]}
        />
      )}
    </div>
  );
}
