export type GoalsLevel = 1 | 2 | 3 | 4 | 5;

export interface InProgressStatus {
  type: "inProgress";
  currentLevel: GoalsLevel;
}

export type GoalsStatus = InProgressStatus | AccomplishedStatus;

export interface AccomplishedStatus {
  type: "accomplished";
}

export interface AllGoalsStatus {
  likeCountStatus: GoalsStatus;
  viewerCountStatus: GoalsStatus;
  isSubscriberCountGoalAccomplished: boolean;
}
