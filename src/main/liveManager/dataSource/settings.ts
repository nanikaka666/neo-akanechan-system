import { UserSettingsService } from "../../../main/userSettings";
import { LiveSettings } from "../../../types/liveSettings";

export class LiveSettingsManager {
  #settings: LiveSettings;
  constructor() {
    this.#settings = this.#buildSettings();
  }
  #buildSettings() {
    // const userSettings = UserSettingsService.getUserSettings()
    return {
      likeCountGoal: {
        maxLevel: 1 as const,
        goalValues: [0, 100],
      },
      viewerCountGoal: {
        maxLevel: 3 as const,
        goalValues: [0, 10, 50, 100],
      },
      subscriberCountGoal: 100,
    };
  }
  update() {
    this.#settings = this.#buildSettings();
  }
  get() {
    return this.#settings;
  }
}
