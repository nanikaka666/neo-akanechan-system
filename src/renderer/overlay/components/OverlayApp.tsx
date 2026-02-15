import { CarouselManager } from "./CarouselManager";
import { Clock } from "./Clock";
import { PoppingManager } from "./PoppingManager";
import { LikeCountIndicator } from "./LikeCountIndicator";
import { ViewerCountIndicator } from "./ViewerCountIndicator";
import { SubscriberCountIndicator } from "./SubscriberCountIndicator";
import { useEffect, useState } from "react";
import { useLiveSettings } from "./hooks/useLiveSettings";
import { useLiveStatistics } from "./hooks/useLiveStatistics";
import { useOverlayEvent } from "./hooks/useOverlayEvent";
import { GoalsLevel, GoalsStatus } from "../../../types/goals";
import { OnDemandPoppingManager } from "./OnDemandPoppingManager";

export function OverlayApp() {
  const liveSettings = useLiveSettings();
  const liveStatistics = useLiveStatistics();
  const [overlayEvent, overlayEventResetFunc] = useOverlayEvent();
  const [likeCountLevel, setLikeCountLevel] = useState<GoalsStatus>({
    type: "inProgress",
    currentLevel: 1,
  });

  useEffect(() => {
    // to rewrite default settings by latest LiveSettings
    window.ipcApi.requestSyncLiveSettings();
  }, []);

  const poppingOnDemand =
    overlayEvent.type === "likeCountLevelPromotion"
      ? {
          buffer: overlayEvent.points,
          funcOnLastAnimationEnded: () => {
            console.log("Do funcOnLastAnimationEnded");
            overlayEventResetFunc();
            if (likeCountLevel.type === "inProgress") {
              if (likeCountLevel.currentLevel === liveSettings.likeCountGoal.maxLevel) {
                setLikeCountLevel(() => {
                  return { type: "accomplished" };
                });
              } else {
                setLikeCountLevel(() => {
                  return {
                    type: "inProgress",
                    currentLevel: (likeCountLevel.currentLevel + 1) as GoalsLevel,
                  };
                });
              }
            }
          },
        }
      : undefined;

  return (
    <div>
      <PoppingManager />
      {poppingOnDemand && <OnDemandPoppingManager onDemand={poppingOnDemand} />}
      <CarouselManager
        items={[
          <LikeCountIndicator
            key={1}
            gaugeLevel={
              likeCountLevel.type === "accomplished"
                ? liveSettings.likeCountGoal.maxLevel
                : likeCountLevel.currentLevel
            }
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
