import { ChannelId, ChannelTitle, VideoTitle } from "youtube-live-scraper";
import { UserSettings } from "./main/userSettings";

export interface ChannelSummary {
  channelId: ChannelId;
  channelTitle: ChannelTitle;
  subscribersCount: number;
  ownerIcon: string;
  channelBanner?: string;
}

export interface LiveSummary {
  title: VideoTitle;
  thumbnail: string;
  isOnAir: boolean;
}

export interface ChannelHavingClosestLive {
  type: "has_closest_live";
  channel: ChannelSummary;
  closestLive: LiveSummary;
}

export interface ChannelHasNoClosestLive {
  type: "has_no_closest_live";
  channel: ChannelSummary;
}

export type ChannelTop = ChannelHavingClosestLive | ChannelHasNoClosestLive;

export interface LiveLaunchProperties {
  channel: ChannelHavingClosestLive;
  settings: UserSettings;
  overlayWindowTitle: string;
}

/**
 * Ipc channel interfaces.
 *
 * key represents channel name.
 */
export interface IpcEvent {
  /**
   * this event will be fired when need to check channel id.
   * "check" means confirm of existing or fetch data about the channel.
   *
   * if the channel was not found match to `inputChannelId`, `undefined` will be returned.
   */
  confirmInputChannelId: (inputChannelId: ChannelId) => ChannelSummary | undefined;

  /**
   * Get the main channel id (in Youtube ID style).
   */
  getMainChannelId: () => ChannelId | undefined;

  /**
   * Register new channel, and mark as main channel.
   *
   * if given channelId was already registered, `false` will be returned.
   */
  registerChannel: (channelId: ChannelId) => boolean;

  /**
   * Switch "MainChannel" to another one.
   *
   * The channel id must be stored in storage.
   * when failed switching, `false` will be returned.
   */
  switchMainChannel: (to: ChannelId) => boolean;

  /**
   * Delete channel data from storage.
   *
   * it affects on registeredChannelIds, userSettings, mainChannelId.
   */
  deleteChannelWithUserConfirmation: (channel: ChannelSummary) => boolean;

  /**
   * Tell a event that changing the main channel.
   *
   * Main channel accepts `undefined`, if this app has no registrated channel id.
   */
  tellNewMainChannelId: (channelId?: ChannelId) => void;

  /**
   * Get channels stored in storage.
   */
  getRegisterdChannels: () => ChannelSummary[];

  /**
   * Tell latest channel list to renderer.
   */
  tellUpdatedChannelIds: (channels: ChannelSummary[]) => void;

  /**
   * Get data for main channel top page.
   */
  getChannelTop: (channelId: ChannelId) => ChannelTop | undefined;

  /**
   * Confirm to user that overlay feature should starts.
   */
  startOverlayWithUserConfirmation: (channelHavingClosestLive: ChannelHavingClosestLive) => boolean;

  /**
   * Tell that overlay is started to renderer.
   */
  tellOverlayStarted: (liveLaunchProperties: LiveLaunchProperties) => void;

  /**
   * Start emitters depend on user settings.
   */
  launchEmitters: (liveLaunchProperties: LiveLaunchProperties) => boolean;

  /**
   * Get UserSettings attached to given channel id.
   *
   * if no settings then filled with default value.
   */
  getUserSettings: (channelId: ChannelId) => UserSettings;

  /**
   * Save userSettings to storage.
   *
   * if saving will be failed by some reasons, `false` will be returned.
   */
  saveUserSettings: (channelId: ChannelId, userSettings: UserSettings) => boolean;

  /**
   * Check existance of difference of user settings.
   */
  hasDifferenceAmongUserSettings: (settingsA: UserSettings, settingsB: UserSettings) => boolean;

  /**
   * Notify updated UserSettings to renderer.
   */
  tellUpdatedUserSettings: (channelId: ChannelId, settings: UserSettings) => void;

  /**
   * Notify counts of chats to renderer.
   *
   * counts means number of text chat, superchat, superstickers; effect of removing chat and blocking user is reflected.
   */
  tellChatCount: (chatCount: number) => void;

  /**
   * Notify counts of chat UU to renderer.
   */
  tellChatUniqueUserCount: (chatUU: number) => void;

  /**
   * Notify counts of like to renderer.
   */
  tellLikeCount: (likeCount: number) => void;
}
