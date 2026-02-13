import { CarouselManager } from "./CarouselManager";
import { Clock } from "./Clock";
import { PoppingManager } from "./PoppingManager";
import { LikeCountIndicator } from "./LikeCountIndicator";
import { ViewerCountIndicator } from "./ViewerCountIndicator";
import { SubscriberCountIndicator } from "./SubscriberCountIndicator";
import { useEffect } from "react";
import { useLiveSettings } from "./hooks/useLiveSettings";
import { useLiveStatistics } from "./hooks/useLiveStatistics";

export function OverlayApp() {
  const liveSettings = useLiveSettings();
  const liveStatistics = useLiveStatistics();
  useEffect(() => {
    // to rewrite default settings by latest LiveSettings
    window.ipcApi.requestSyncLiveSettings();
  }, []);

  return (
    <div>
      <PoppingManager />
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
            gaugeLevel={1}
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
    </div>
  );
}
