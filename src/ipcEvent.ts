import { UserSettings } from "./main/userSettings";
import {
  ChatItemSuperChat,
  ChatItemSuperSticker,
  ChatItemText,
  GiftRedemption,
  MembershipMilestone,
  NewMembership,
  SponsorshipsGift,
} from "youtube-livechat-emitter/dist/src/types/liveChat";
import { ActiveLiveChatId, ChannelId, LiveChatId, VideoId } from "./main/youtubeApi/model";

/**
 * User doesn't authorized.
 */
export interface AuthPage {
  type: "auth";
}

/**
 * Represents page which user selects a live from registered channels.
 */
export interface LiveSelectionPage {
  type: "liveSelection";
  channel: Channel;
  lives: YoutubeLive[];
}

/**
 * Represents page which user selected a live and does preparing.
 *
 * in this status, the emitters are not started.
 */
export interface LiveStandByPage {
  type: "liveStandBy";
  liveLaunchProperties: LiveLaunchProperties;
}

/**
 * Reperesents page which user start streaming.
 */
export interface InLivePage {
  type: "inLive";
  liveLaunchProperties: LiveLaunchProperties;
}

/**
 * Represents MainApp status where user is in.
 */
export type MainAppPage = AuthPage | LiveSelectionPage | LiveStandByPage | InLivePage;

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
  scheduledStartTime: Date;
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
 * Summary data about the live shown on SideBar.
 */
export interface LiveStatistics {
  currentLikeCount: number;
  maxLikeCount: number;
  currentLiveViewCount: number;
  maxLiveViewCount: number;
  textChatCount: number;
  superChatCount: number;
  superStickerCount: number;
  chatUUCount: number;
  currentSubscriberCount: number;
  maxSubscriberCount: number;
  newMembershipsCount: number;
  membershipMilestoneCount: number;
  giftCount: number;
  redemptionGiftCount: number;
  stocksCount: number;
}

/**
 * `isStocked` is unknown (always false more correctly) when live chat receiving.
 *
 * So `isStocked` will be calculated when every sending data to renderer.
 */
export type NonMarkedExtendedChatItemText = Omit<ExtendedChatItemText, "isStocked" | "isFocused">;
export type NonMarkedExtendedChatItemSuperChat = Omit<ExtendedChatItemSuperChat, "isFocused">;
export type NonMarkedExtendedChatItemSuperSticker = Omit<ExtendedChatItemSuperSticker, "isFocused">;

/**
 * Append some data to ChatItemText from youtube-livechat-emitter
 */
export type ExtendedChatItemText = ChatItemText & {
  /**
   * index which means position of whole text chat list.
   */
  indexOfWhole: number;

  /**
   * HH:mm:ss style time format
   */
  formatedTime: string;

  /**
   * `true` means this is first chat for author.
   */
  isFirst: boolean;

  /**
   * `true` means this is stocked by streamer.
   */
  isStocked: boolean;

  /**
   * `true` means this is focused by streamer.
   */
  isFocused: boolean;
};

export type ExtendedChatItemSuperChat = ChatItemSuperChat & {
  formatedTime: string;
  isFirst: boolean;
  isFocused: boolean;
};

export type ExtendedChatItemSuperSticker = ChatItemSuperSticker & {
  formatedTime: string;
  isFirst: boolean;
  isFocused: boolean;
};

export type ExtendedSuperItem = ExtendedChatItemSuperChat | ExtendedChatItemSuperSticker;

export type ExtendedNewMembership = NewMembership & {
  formatedTime: string;
};

export type ExtendedMembershipMilestone = MembershipMilestone & {
  formatedTime: string;
};

export type ExtendedSponsorshipsGift = SponsorshipsGift & {
  type: "gift";
  num: number;
  formatedTime: string;
  id: string; // todo: id must be given livechat-emitter module
};

export type ExtendedGiftRedemption = GiftRedemption & {
  type: "redemption";
  formatedTime: string;
};

export type ExtendedMembershipAndGiftItem =
  | ExtendedNewMembership
  | ExtendedMembershipMilestone
  | ExtendedSponsorshipsGift
  | ExtendedGiftRedemption;

/**
 * A chat item on which owner focuses.
 *
 * Owner can have only one focused item at time.
 */
export type FocusedOnChatItem =
  | ExtendedChatItemText
  | ExtendedChatItemSuperChat
  | ExtendedChatItemSuperSticker;

/**
 * Unit of chat data for transfer to renderer.
 */
export interface Chats {
  textChats: {
    items: ExtendedChatItemText[];
    num: number;
  };
  superChatAndStickers: ExtendedSuperItem[];
  stocks: ExtendedChatItemText[];
  focus?: FocusedOnChatItem;
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
  tellMembershipsAndGifts: (membershipsAndGifts: ExtendedMembershipAndGiftItem[]) => void;

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
