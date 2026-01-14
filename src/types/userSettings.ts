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
