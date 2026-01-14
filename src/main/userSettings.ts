import { GoalsSettings, LiveChatSettings, UserSettings } from "../types/userSettings";
import { getStorageService } from "./storage";

/**
 * Collection of UserSettings data operations.
 */
export const UserSettingsService = {
  /**
   * Get current UserSettings.
   *
   * This function will return non-partial UserSettings.
   */
  getUserSettings: (): UserSettings => {
    const storedSettings = getStorageService().getUserSettings();
    if (storedSettings === undefined) {
      return DefaultSettings;
    } else {
      return { ...DefaultSettings, ...storedSettings };
    }
  },

  /**
   * Set UserSettings.
   *
   * this function allow to receive partial settings data.
   * settings properties not included in given settings will not be changed.
   */
  setUserSettings: (newSettings: Partial<UserSettings>) => {
    const current = UserSettingsService.getUserSettings();
    getStorageService().registerUserSettings({ ...current, ...newSettings });
  },

  /**
   * Compare user settings object.
   */
  isEqual: (settingsA: UserSettings, settingsB: UserSettings): boolean => {
    for (const key of Object.keys(DefaultSettings) as (keyof UserSettings)[]) {
      if (settingsA[key] !== settingsB[key]) {
        return false;
      }
    }
    return true;
  },
};
export const DefaultSettings: UserSettings = {
  ...({
    useLiveChatDisplay: true,
    displayStyle: "typical",
    authorIconVisibility: true,
    authorNameVisibility: true,
    membershipBadgeVisibility: true,
    decorateFirstChat: true,
  } satisfies LiveChatSettings),
  ...({
    useSubscribersCountGoal: true,
    useLikeCountGoal: true,
    useLiveViewCountGoal: true,
  } satisfies GoalsSettings),
};
