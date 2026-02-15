import { CarouselManager } from "./CarouselManager";
import { Clock } from "./Clock";
import { PoppingManager } from "./PoppingManager";
import { LikeCountIndicator } from "./LikeCountIndicator";
import { ViewerCountIndicator } from "./ViewerCountIndicator";
import { SubscriberCountIndicator } from "./SubscriberCountIndicator";
import { useCallback, useEffect, useState } from "react";
import { useLiveSettings } from "./hooks/useLiveSettings";
import { useLiveStatistics } from "./hooks/useLiveStatistics";
import { useOverlayEvent } from "./hooks/useOverlayEvent";
import { GoalsLevel, GoalsStatus } from "../../../types/goals";
import { OnDemand, OnDemandPoppingManager } from "./OnDemandPoppingManager";

export function OverlayApp() {
  const liveSettings = useLiveSettings();
  const liveStatistics = useLiveStatistics();
  const [overlayEvent, overlayEventResetFunc] = useOverlayEvent();
  const [likeCountLevel, setLikeCountLevel] = useState<GoalsStatus>({
    type: "inProgress",
    currentLevel: 1,
  });
  const [viewerCountLevel, setViewerCountLevel] = useState<GoalsStatus>({
    type: "inProgress",
    currentLevel: 1,
  });

  useEffect(() => {
    // to rewrite default settings by latest LiveSettings
    window.ipcApi.requestSyncLiveSettings();
  }, []);

  const likeCountPromotion = useCallback(() => {
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
  }, [likeCountLevel, liveSettings]);

  const viewerCountPromotion = useCallback(() => {
    if (viewerCountLevel.type === "inProgress") {
      if (viewerCountLevel.currentLevel === liveSettings.viewerCountGoal.maxLevel) {
        setViewerCountLevel(() => {
          return { type: "accomplished" };
        });
      } else {
        setViewerCountLevel(() => {
          return {
            type: "inProgress",
            currentLevel: (viewerCountLevel.currentLevel + 1) as GoalsLevel,
          };
        });
      }
    }
  }, [viewerCountLevel, liveSettings]);

  // handle the case which list is empty when promotion
  // it is not fired last popping animation event, because popping item is nothing.
  // to cause promotion process, handle it here.
  if (overlayEvent.type === "likeCountLevelPromotion" && overlayEvent.points.length === 0) {
    setTimeout(() => {
      overlayEventResetFunc();
      likeCountPromotion();
    }, 5 * 1000);
  } else if (
    overlayEvent.type === "viewerCountLevelPromotion" &&
    overlayEvent.points.length === 0
  ) {
    setTimeout(() => {
      overlayEventResetFunc();
      viewerCountPromotion();
    }, 5 * 1000);
  }

  const poppingOnDemand: OnDemand | undefined =
    overlayEvent.type === "likeCountLevelPromotion"
      ? {
          buffer: overlayEvent.points,
          funcOnLastAnimationEnded: () => {
            overlayEventResetFunc();
            likeCountPromotion();
          },
        }
      : overlayEvent.type === "viewerCountLevelPromotion"
        ? {
            buffer: overlayEvent.points,
            funcOnLastAnimationEnded: () => {
              overlayEventResetFunc();
              viewerCountPromotion();
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
            gaugeLevel={
              viewerCountLevel.type === "accomplished"
                ? liveSettings.viewerCountGoal.maxLevel
                : viewerCountLevel.currentLevel
            }
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
