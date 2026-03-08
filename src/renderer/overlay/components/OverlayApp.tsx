import { CarouselManager } from "./carousel/CarouselManager";
import { Clock } from "./clock/Clock";
import { LikeCountIndicator } from "./indicator/LikeCountIndicator";
import { ViewerCountIndicator } from "./indicator/ViewerCountIndicator";
import { SubscriberCountIndicator } from "./indicator/SubscriberCountIndicator";
import { useCallback, useEffect, useState } from "react";
import { useLiveSettings } from "./hooks/useLiveSettings";
import { useLiveStatistics } from "./hooks/useLiveStatistics";
import { useOverlayEvent } from "./hooks/useOverlayEvent";
import { ChatLogManager } from "./chatLog/ChatLogManager";
import { RankingView } from "./ranking/RankingView";
import { AppLogManager } from "./appLog/AppLogManager";
import { CompetitionView } from "./competition/CompetitionView";
import { OnDemand, OnDemandPoppingManager } from "./popping/OnDemandPoppingManager";
import { PoppingManager } from "./popping/PoppingManager";
import { FocusView } from "./focus/FocusView";
import { useLikeCountGoalStatus } from "./hooks/useLikeCountGoalStatus";
import { useViewerCountGoalStatus } from "./hooks/useViewerCountGoalStatus";

export function OverlayApp() {
  const liveSettings = useLiveSettings();
  const liveStatistics = useLiveStatistics();
  const [overlayEvent, overlayEventResetFunc] = useOverlayEvent();

  const [likeCountGoalStatus, likeCountPromotionFunc] = useLikeCountGoalStatus();
  const [viewerCountGoalStatus, viewerCountPromotionFunc] = useViewerCountGoalStatus();

  const [isSubscriberCountGoalAccomplished, setIsSubscriberCountGoalAccomplished] = useState(false);

  useEffect(() => {
    // to rewrite default settings by latest LiveSettings
    window.ipcApi.requestSyncLiveSettings();
  }, []);

  const subscriberCountPromotion = useCallback(() => {
    setIsSubscriberCountGoalAccomplished((_) => true);
  }, []);

  // handle the case which list is empty when promotion
  // it is not fired last popping animation event, because popping item is nothing.
  // to cause promotion process, handle it here.
  if (overlayEvent.type === "likeCountLevelPromotion" && overlayEvent.points.length === 0) {
    setTimeout(() => {
      overlayEventResetFunc();
      likeCountPromotionFunc();
    }, 5 * 1000);
  } else if (
    overlayEvent.type === "viewerCountLevelPromotion" &&
    overlayEvent.points.length === 0
  ) {
    setTimeout(() => {
      overlayEventResetFunc();
      viewerCountPromotionFunc();
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
            likeCountPromotionFunc();
          },
        }
      : overlayEvent.type === "viewerCountLevelPromotion"
        ? {
            buffer: overlayEvent.points,
            funcOnLastAnimationEnded: () => {
              overlayEventResetFunc();
              viewerCountPromotionFunc();
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
          likeCountGoalStatus.type === "accomplished"
            ? liveSettings.likeCountGoal.maxLevel
            : likeCountGoalStatus.currentLevel
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
          viewerCountGoalStatus.type === "accomplished"
            ? liveSettings.viewerCountGoal.maxLevel
            : viewerCountGoalStatus.currentLevel
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
    if (overlayEvent.type === "noEvent") {
      return [likeCount, viewerCount, subscriberCount];
    } else if (overlayEvent.type === "likeCountLevelPromotion") {
      return [likeCount];
    } else if (overlayEvent.type === "viewerCountLevelPromotion") {
      return [viewerCount];
    } else {
      return [subscriberCount];
    }
  }, [liveSettings, liveStatistics, likeCountGoalStatus, viewerCountGoalStatus, overlayEvent]);

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
      <Clock />
    </div>
  );
}
