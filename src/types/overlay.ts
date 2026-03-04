import {
  CompetitionPayoutLog,
  LikeCountGoalAccomplishedLog,
  LikeCountGoalPromotionLog,
  SubscriberCountGoalAccomplishedLog,
  ViewerCountGoalAccomplishedLog,
  ViewerCountGoalPromotionLog,
} from "./appLog";

export interface PointInfoFromMainProcess {
  img: string;
  point: number;
}

export type OverlayEvent =
  | NoEvent
  | LikeCountLevelPromotionEvent
  | ViewerCountLevelPromotionEvent
  | SubscriberCountGoalAchivementEvent
  | CompetitionPayoutEvent;

export interface NoEvent {
  type: "noEvent";
}

export interface LikeCountLevelPromotionEvent {
  type: "likeCountLevelPromotion";
  points: PointInfoFromMainProcess[];
  appLog: LikeCountGoalPromotionLog | LikeCountGoalAccomplishedLog;
}

export interface ViewerCountLevelPromotionEvent {
  type: "viewerCountLevelPromotion";
  points: PointInfoFromMainProcess[];
  appLog: ViewerCountGoalPromotionLog | ViewerCountGoalAccomplishedLog;
}

export interface SubscriberCountGoalAchivementEvent {
  type: "subscriberCountGoalAchivement";
  points: PointInfoFromMainProcess[];
  appLog: SubscriberCountGoalAccomplishedLog;
}

export interface CompetitionPayoutEvent {
  type: "competitionPayout";
  points: PointInfoFromMainProcess[];
  appLog: CompetitionPayoutLog;
}
