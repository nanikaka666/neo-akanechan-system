import { GoalsLevel } from "./goals";

export interface Goal {
  maxLevel: GoalsLevel;
  goalValues: number[];
}

/**
 * Settings Set for Live.
 *
 * it's based on UserSettings.
 */
export interface LiveSettings {
  likeCountGoal: Goal;
  viewerCountGoal: Goal;
  subscriberCountGoal: number;
}
