import { GoalsLevel } from "./goals";

export type AppLog =
  | LikeCountGoalPromotionLog
  | LikeCountGoalAccomplishedLog
  | ViewerCountGoalPromotionLog
  | ViewerCountGoalAccomplishedLog
  | SubscriberCountGoalAccomplishedLog;

export interface LikeCountGoalPromotionLog {
  type: "likeCountGoalPromotion";
  logId: string;
  level: GoalsLevel;
  goalValue: number;
}

export interface LikeCountGoalAccomplishedLog {
  type: "likeCountGoalAccomplished";
  logId: string;
  goalValue: number;
}

export interface ViewerCountGoalPromotionLog {
  type: "viewerCountGoalPromotion";
  logId: string;
  level: GoalsLevel;
  goalValue: number;
}

export interface ViewerCountGoalAccomplishedLog {
  type: "viewerCountGoalAccomplished";
  logId: string;
  goalValue: number;
}

export interface SubscriberCountGoalAccomplishedLog {
  type: "subscriberCountGoalAccomplished";
  logId: string;
  goalValue: number;
}
