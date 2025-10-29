import { ChannelId } from "youtube-live-scraper";
import { getStorageService } from "./storage";

/**
 * Top level interface represents user settings.
 *
 * UserSettings is consisted with intersections of each type of settings.
 */
export type UserSettings = LiveChatSettings;

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

const DefaultSettings: UserSettings = {
  ...({
    useLiveChatDisplay: true,
    displayStyle: "typical",
    authorIconVisibility: true,
    authorNameVisibility: true,
    membershipBadgeVisibility: true,
    decorateFirstChat: true,
  } satisfies LiveChatSettings),
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
    if (channelId.isHandle) {
      throw new Error(`ChannelId must be Youtube ID style. ${channelId.id}`);
    }
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
    if (channelId.isHandle) {
      throw new Error(`ChannelId must be Youtube ID style. ${channelId.id}`);
    }
    const current = UserSettingsService.getUserSettings(channelId);
    getStorageService().registerUserSettings(channelId, { ...current, ...newSettings });
  },

  /**
   * Compare user settings object.
   */
  isEqual: (settingsA: UserSettings, settingsB: UserSettings): boolean => {
    // console.log("");
    for (const key of Object.keys(DefaultSettings) as (keyof UserSettings)[]) {
      //   console.log(`Compare key: ${key} A: ${settingsA[key]} B: ${settingsB[key]}`);
      if (settingsA[key] !== settingsB[key]) {
        // console.log("Different!!!");
        return false;
      }
    }

    // console.log("Same!!!");
    return true;
  },
};
