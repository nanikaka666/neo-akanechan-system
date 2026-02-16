import { AllGoalsStatus, GoalsLevel } from "../../../types/goals";

export class GoalsManager {
  #goalsStatus: AllGoalsStatus;
  constructor() {
    this.#goalsStatus = {
      likeCountStatus: { type: "inProgress", currentLevel: 1 },
      viewerCountStatus: { type: "inProgress", currentLevel: 1 },
      isSubscriberCountGoalAccomplished: false,
    };
  }
  promotionLikeCount() {
    if (this.#goalsStatus.likeCountStatus.type === "accomplished") {
      throw new Error("promotion called when LikeCount goals is accomplished.");
    }
    const status = this.#goalsStatus.likeCountStatus;
    if (status.currentLevel === 5) {
      this.#goalsStatus.likeCountStatus = {
        type: "accomplished",
      };
    } else {
      this.#goalsStatus.likeCountStatus = {
        type: "inProgress",
        currentLevel: (status.currentLevel + 1) as GoalsLevel,
      };
    }
  }
  promotionViewerCount() {
    if (this.#goalsStatus.viewerCountStatus.type === "accomplished") {
      throw new Error("promotion called when LiveViewCount goals is accomplished.");
    }
    const status = this.#goalsStatus.viewerCountStatus;
    if (status.currentLevel === 5) {
      this.#goalsStatus.viewerCountStatus = {
        type: "accomplished",
      };
    } else {
      this.#goalsStatus.viewerCountStatus = {
        type: "inProgress",
        currentLevel: (status.currentLevel + 1) as GoalsLevel,
      };
    }
  }
  accomplishSubscriberCountGoal() {
    if (this.#goalsStatus.isSubscriberCountGoalAccomplished) {
      throw new Error("accomplish method called when SubscriberCount goals is accomplished.");
    }
    this.#goalsStatus.isSubscriberCountGoalAccomplished = true;
  }
  get() {
    return this.#goalsStatus;
  }
}
