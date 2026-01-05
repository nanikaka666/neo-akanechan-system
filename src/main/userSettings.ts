import { getStorageService } from "./storage";
import { ChannelId } from "./youtubeApi/model";

/**
 * Top level interface represents user settings.
 *
 * UserSettings is consisted with intersections of each type of settings.
 */
export type UserSettings = LiveChatSettings & GoalsSettings;

export type LiveChatDisplayStyle = "typical";

/**
 * Settings around Live Chat Display, part of UserSettings.
 */
export interface LiveChatSettings {
  /**
   * Flag that live chat item display on overlay window.
   */
  useLiveChatDisplay: boolean;

  /**
   * How to display live chats on overlay window.
   */
  displayStyle: LiveChatDisplayStyle;

  /**
   * Visibility: user icon.
   */
  authorIconVisibility: boolean;

  /**
   * Visibility: user name.
   */
  authorNameVisibility: boolean;

  /**
   * Visibility: membership badge.
   */
  membershipBadgeVisibility: boolean;

  /**
   * Effects: Decorates a chat item which someone's first chat.
   */
  decorateFirstChat: boolean;
}

/**
 * Settings about owner's goals, part of UserSettings.
 */
export interface GoalsSettings {
  /**
   * Turn on indicator of subscribers count.
   */
  useSubscribersCountGoal: boolean;

  /**
   * Turn on indicator of like count.
   */
  useLikeCountGoal: boolean;

  /**
   * Turn on indicator of live view count.
   */
  useLiveViewCountGoal: boolean;
}

const DefaultSettings: UserSettings = {
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

/**
 * Collection of UserSettings data operations.
 */
export const UserSettingsService = {
  /**
   * Get current UserSettings.
   *
   * This function will return non-partial UserSettings.
   */
  getUserSettings: (channelId: ChannelId): UserSettings => {
    const storedSettings = getStorageService().getUserSettings(channelId);
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
  setUserSettings: (channelId: ChannelId, newSettings: Partial<UserSettings>) => {
    const current = UserSettingsService.getUserSettings(channelId);
    getStorageService().registerUserSettings(channelId, { ...current, ...newSettings });
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
