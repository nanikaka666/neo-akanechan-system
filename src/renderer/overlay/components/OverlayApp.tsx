import { CarouselManager } from "./carousel/CarouselManager";
import { Clock } from "./clock/Clock";
import { LikeCountIndicator } from "./indicator/LikeCountIndicator";
import { ViewerCountIndicator } from "./indicator/ViewerCountIndicator";
import { SubscriberCountIndicator } from "./indicator/SubscriberCountIndicator";
import { useCallback, useEffect, useState } from "react";
import { useLiveSettings } from "./hooks/useLiveSettings";
import { useLiveStatistics } from "./hooks/useLiveStatistics";
import { useOverlayEvent } from "./hooks/useOverlayEvent";
import { GoalsLevel, GoalsStatus } from "../../../types/goals";
import { ChatLogManager } from "./chatLog/ChatLogManager";
import { FocusView } from "./FocusView";
import { RankingView } from "./ranking/RankingView";
import { AppLogManager } from "./appLog/AppLogManager";
import { CompetitionView } from "./competition/CompetitionView";
import { OnDemand, OnDemandPoppingManager } from "./popping/OnDemandPoppingManager";
import { PoppingManager } from "./popping/PoppingManager";

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
  const [isSubscriberCountGoalAccomplished, setIsSubscriberCountGoalAccomplished] = useState(false);

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

  const subscriberCountPromotion = useCallback(() => {
    setIsSubscriberCountGoalAccomplished((_) => true);
  }, []);

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
  } else if (
    overlayEvent.type === "subscriberCountGoalAchivement" &&
    overlayEvent.points.length === 0
  ) {
    setTimeout(() => {
      overlayEventResetFunc();
      subscriberCountPromotion();
    }, 5 * 1000);
  } else if (overlayEvent.type === "competitionPayout" && overlayEvent.points.length === 0) {
    setTimeout(() => {
      overlayEventResetFunc();
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
        : overlayEvent.type === "subscriberCountGoalAchivement"
          ? {
              buffer: overlayEvent.points,
              funcOnLastAnimationEnded: () => {
                overlayEventResetFunc();
                subscriberCountPromotion();
              },
            }
          : overlayEvent.type === "competitionPayout"
            ? {
                buffer: overlayEvent.points,
                funcOnLastAnimationEnded: () => {
                  overlayEventResetFunc();
                },
              }
            : undefined;

  const makeCarouselItems = useCallback(() => {
    const likeCount = (
      <LikeCountIndicator
        key={"likeCount"}
        gaugeLevel={
          likeCountLevel.type === "accomplished"
            ? liveSettings.likeCountGoal.maxLevel
            : likeCountLevel.currentLevel
        }
        goal={liveSettings.likeCountGoal}
        currentValue={liveStatistics.currentLikeCount}
        maxValueSoFar={liveStatistics.maxLikeCount}
      />
    );
    const viewerCount = (
      <ViewerCountIndicator
        key={"viewerCount"}
        gaugeLevel={
          viewerCountLevel.type === "accomplished"
            ? liveSettings.viewerCountGoal.maxLevel
            : viewerCountLevel.currentLevel
        }
        goal={liveSettings.viewerCountGoal}
        currentValue={liveStatistics.currentLiveViewCount}
        maxValueSoFar={liveStatistics.maxLiveViewCount}
      />
    );
    const subscriberCount = (
      <SubscriberCountIndicator
        key={"subscriberCount"}
        goalValue={liveSettings.subscriberCountGoal}
        currentValue={liveStatistics.currentSubscriberCount}
        maxValueSoFar={liveStatistics.maxSubscriberCount}
      />
    );
    const clock = <Clock key={"clock"} />;
    if (overlayEvent.type === "noEvent") {
      return [likeCount, viewerCount, subscriberCount, clock];
    } else if (overlayEvent.type === "likeCountLevelPromotion") {
      return [likeCount];
    } else if (overlayEvent.type === "viewerCountLevelPromotion") {
      return [viewerCount];
    } else {
      return [subscriberCount];
    }
  }, [liveSettings, liveStatistics, likeCountLevel, viewerCountLevel, overlayEvent]);

  return (
    <div>
      <PoppingManager />
      {poppingOnDemand && <OnDemandPoppingManager onDemand={poppingOnDemand} />}
      <CarouselManager items={makeCarouselItems()} />
      <AppLogManager overlayEvent={overlayEvent} />
      <ChatLogManager />
      <FocusView />
      <RankingView />
      <CompetitionView />
    </div>
  );
}
