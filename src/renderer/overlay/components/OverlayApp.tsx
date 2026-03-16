import { CarouselManager } from "./carousel/CarouselManager";
import { Clock } from "./clock/Clock";
import { LikeCountIndicator } from "./indicator/LikeCountIndicator";
import { ViewerCountIndicator } from "./indicator/ViewerCountIndicator";
import { SubscriberCountIndicator } from "./indicator/SubscriberCountIndicator";
import { useCallback } from "react";
import { useLiveSettings } from "../../hooks/useLiveSettings";
import { useLiveStatistics } from "./hooks/useLiveStatistics";
import { useOverlayEvent } from "./hooks/useOverlayEvent";
import { ChatLogManager } from "./chatLog/ChatLogManager";
import { Ranking } from "./ranking/Ranking";
import { AnnouncementManager } from "./announcement/AnnouncementManager";
import { CompetitionView } from "./competition/CompetitionView";
import { OnDemand, OnDemandPoppingManager } from "./popping/OnDemandPoppingManager";
import { PoppingManager } from "./popping/PoppingManager";
import { FocusView } from "./focus/FocusView";
import { useLikeCountGoalStatus } from "./hooks/useLikeCountGoalStatus";
import { useViewerCountGoalStatus } from "./hooks/useViewerCountGoalStatus";
import { useIsSubscriberCountGoalAccomplished } from "./hooks/useIsSubscriberCountGoalAccomplished";

export function OverlayApp() {
  const liveSettings = useLiveSettings();
  const liveStatistics = useLiveStatistics();
  const [overlayEvent, overlayEventResetFunc] = useOverlayEvent();

  const [likeCountGoalStatus, likeCountPromotionFunc] = useLikeCountGoalStatus();
  const [viewerCountGoalStatus, viewerCountPromotionFunc] = useViewerCountGoalStatus();

  const [isSubscriberCountGoalAccomplished, subscriberCountGoalAccomplishFunc] =
    useIsSubscriberCountGoalAccomplished();

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
      subscriberCountGoalAccomplishFunc();
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
                subscriberCountGoalAccomplishFunc();
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
        isAccomplished={likeCountGoalStatus.type === "accomplished"}
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
        isAccomplished={viewerCountGoalStatus.type === "accomplished"}
      />
    );
    const subscriberCount = (
      <SubscriberCountIndicator
        key={"subscriberCount"}
        goalValue={liveSettings.subscriberCountGoal}
        currentValue={liveStatistics.currentSubscriberCount}
        maxValueSoFar={liveStatistics.maxSubscriberCount}
        isAccomplished={isSubscriberCountGoalAccomplished}
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
  }, [
    liveSettings,
    liveStatistics,
    likeCountGoalStatus,
    viewerCountGoalStatus,
    isSubscriberCountGoalAccomplished,
    overlayEvent,
  ]);

  return (
    <div>
      <PoppingManager />
      {poppingOnDemand && <OnDemandPoppingManager onDemand={poppingOnDemand} />}
      <CarouselManager items={makeCarouselItems()} />
      <AnnouncementManager overlayEvent={overlayEvent} />
      <ChatLogManager />
      <FocusView />
      <Ranking />
      <CompetitionView />
      <Clock />
    </div>
  );
}
