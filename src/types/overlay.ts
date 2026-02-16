export interface PointInfoFromMainProcess {
  img: string;
  point: number;
}

export type OverlayEvent =
  | NoEvent
  | LikeCountLevelPromotionEvent
  | ViewerCountLevelPromotionEvent
  | SubscriberCountGoalAchivementEvent;

export interface NoEvent {
  type: "noEvent";
}

export interface LikeCountLevelPromotionEvent {
  type: "likeCountLevelPromotion";
  points: PointInfoFromMainProcess[];
}

export interface ViewerCountLevelPromotionEvent {
  type: "viewerCountLevelPromotion";
  points: PointInfoFromMainProcess[];
}

export interface SubscriberCountGoalAchivementEvent {
  type: "subscriberCountGoalAchivement";
  points: PointInfoFromMainProcess[];
}
