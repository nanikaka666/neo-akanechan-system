import { UserSettings } from "./userSettings";
import { ActiveLiveChatId, ChannelId, LiveChatId, VideoId } from "./../main/youtubeApi/model";
import {
  Chats,
  ExtendedChatItemText,
  FocusedOnChatItem,
  MembershipAndGiftItem,
} from "./liveChatItem";
import { AuthPage, LiveSelectionPage, MainAppPage } from "./mainAppPage";
import { LiveStatistics } from "./liveStatistics";

export interface Channel {
  id: ChannelId;
  title: string;
  subscribersCount: number;
  ownerIconUrl: string;
  bannerUrl?: string;
}

export type YoutubeLive = YoutubeLiveInReady | YoutubeLiveInLive;

export interface YoutubeLiveInReady {
  type: "inReady";
  videoId: VideoId;
  liveChatId: LiveChatId | ActiveLiveChatId;
  title: string;
  thumbnailUrl: string;
  scheduledStartTime: Date;
  isPublic: boolean;
}

export interface YoutubeLiveInLive {
  type: "inLive";
  videoId: VideoId;
  liveChatId: LiveChatId | ActiveLiveChatId;
  title: string;
  thumbnailUrl: string;
  actualStartTime: Date;
  isPublic: boolean;
}

export type YoutubeVideo = VideoUpcomingLive | VideoInLive | VideoFinishedLive | NotLiveVideo;

export interface VideoUpcomingLive {
  type: "upcomingLive";
  id: VideoId;
  title: string;
  description: string;
  channelId: ChannelId;
  channelTitle: string;
  thumbnailUrl: string;
  likeCount?: number;
  scheduledStartTime: Date;
  activeLiveChatId: ActiveLiveChatId;
  isPublic: boolean;
}

export interface VideoInLive {
  type: "inLive";
  id: VideoId;
  title: string;
  description: string;
  channelId: ChannelId;
  channelTitle: string;
  thumbnailUrl: string;
  likeCount?: number;
  actualStartTime: Date;
  activeLiveChatId: ActiveLiveChatId;
  concurrentViewers?: number;
  isPublic: boolean;
}

export interface VideoFinishedLive {
  type: "finishedLive";
  id: VideoId;
  title: string;
  description: string;
  channelId: ChannelId;
  channelTitle: string;
  thumbnailUrl: string;
  likeCount?: number;
  actualStartTime: Date;
  actualEndTime: Date;
  isPublic: boolean;
}

export interface NotLiveVideo {
  type: "notLive";
  id: VideoId;
  title: string;
  description: string;
  channelId: ChannelId;
  channelTitle: string;
  thumbnailUrl: string;
  likeCount?: number;
  isPublic: boolean;
}

export interface LiveLaunchProperties {
  channel: Channel;
  live: YoutubeLive;
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
   * Confirm to user that overlay feature should starts.
   */
  startOverlayWithUserConfirmation: (channel: Channel, live: YoutubeLive) => boolean;

  /**
   * Confirm to user that overlay feature should starts with video id.
   *
   * this ipc used for debug.
   */
  startOverlayWithUserConfirmationByVideoId: (inputVideoId: string) => boolean;

  /**
   * Start emitters depend on user settings.
   */
  launchEmitters: (liveLaunchProperties: LiveLaunchProperties) => boolean;

  /**
   * Get UserSettings.
   *
   * if no settings then filled with default value.
   */
  getUserSettings: () => UserSettings;

  /**
   * Save userSettings to storage.
   *
   * if saving will be failed by some reasons, `false` will be returned.
   */
  saveUserSettings: (userSettings: UserSettings) => boolean;

  /**
   * Check existance of difference of user settings.
   */
  hasDifferenceAmongUserSettings: (settingsA: UserSettings, settingsB: UserSettings) => boolean;

  /**
   * Notify updated UserSettings to renderer.
   */
  tellUpdatedUserSettings: (settings: UserSettings) => void;

  /**
   * Notify all memberships and gifts item to renderer.
   */
  tellMembershipsAndGifts: (membershipsAndGifts: MembershipAndGiftItem[]) => void;

  /**
   * Add chat item to stock list.
   */
  addStock: (stock: ExtendedChatItemText) => boolean;

  /**
   * Remove the stock from list.
   */
  removeStock: (stock: ExtendedChatItemText) => boolean;

  /**
   * Notify LiveStatistics to renderer.
   */
  tellLiveStatistics: (statistics: LiveStatistics) => void;

  /**
   * Return MainAppPage for initial status.
   */
  getInitialMainAppPage: () => AuthPage | LiveSelectionPage;

  /**
   * Notify latest MainAppPage to renderer.
   */
  tellMainAppPage: (page: MainAppPage) => void;

  /**
   * transit MainAppPage status to "inLive".
   */
  startLive: (liveLaunchProperties: LiveLaunchProperties) => boolean;

  /**
   * transit MainAppPage status to "liveSelection"
   */
  quitLive: (liveLaunchProperties: LiveLaunchProperties) => boolean;

  /**
   * Update focus item.
   *
   * `undefined` means focused item will be unfocused.
   */
  updateFocus: (focus?: FocusedOnChatItem) => boolean;

  /**
   * Notify latest chat data.
   */
  tellChats: (chats: Chats) => void;

  /**
   * Start auth flow.
   */
  startAuthFlow: () => boolean;
}
