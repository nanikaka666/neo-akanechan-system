import { UserSettingsService } from "../../../main/userSettings";
import { Goal, LiveSettings } from "../../../types/liveSettings";

export class LiveSettingsManager {
  #settings: LiveSettings;
  constructor() {
    this.#settings = this.#buildSettings();
  }
  #buildSettings() {
    const userSettings = UserSettingsService.getUserSettings();
    return {
      likeCountGoal: this.#goalValuesComplement(
        userSettings.likeCountGoalMaxValue,
        userSettings.likeCountGoalMaxLevel,
      ),
      viewerCountGoal: this.#goalValuesComplement(
        userSettings.liveViewCountGoalMaxValue,
        userSettings.liveViewCountGoalMaxLevel,
      ),
      subscriberCountGoal: userSettings.subscribersCountGoalValue,
    };
  }

  #goalValuesComplement(maxValue: number, maxLevel: 1 | 2 | 3 | 4 | 5): Goal {
    const divideNum = this.#summation(maxLevel);
    let values: number[] = [0];

    for (let i = 1; i <= maxLevel; i++) {
      values = [...values, Math.round((maxValue * this.#summation(i)) / divideNum)];
    }

    return {
      maxLevel: maxLevel,
      goalValues: values,
    };
  }

  #summation(x: number) {
    return (x * (x + 1)) / 2;
  }

  update() {
    this.#settings = this.#buildSettings();
  }
  get() {
    return this.#settings;
  }
}
