import {
  CompetitionPayoutLog,
  LikeCountGoalAccomplishedLog,
  LikeCountGoalPromotionLog,
  SubscriberCountGoalAccomplishedLog,
  ViewerCountGoalAccomplishedLog,
  ViewerCountGoalPromotionLog,
} from "./announcement";

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
  announcement: LikeCountGoalPromotionLog | LikeCountGoalAccomplishedLog;
}

export interface ViewerCountLevelPromotionEvent {
  type: "viewerCountLevelPromotion";
  points: PointInfoFromMainProcess[];
  announcement: ViewerCountGoalPromotionLog | ViewerCountGoalAccomplishedLog;
}

export interface SubscriberCountGoalAchivementEvent {
  type: "subscriberCountGoalAchivement";
  points: PointInfoFromMainProcess[];
  announcement: SubscriberCountGoalAccomplishedLog;
}

export interface CompetitionPayoutEvent {
  type: "competitionPayout";
  points: PointInfoFromMainProcess[];
  announcement: CompetitionPayoutLog;
}
