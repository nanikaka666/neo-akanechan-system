export interface Goal {
  maxLevel: 1 | 2 | 3 | 4 | 5;
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
