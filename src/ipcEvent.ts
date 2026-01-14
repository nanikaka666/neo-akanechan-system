import { UserSettings } from "./main/userSettings";
import {
  ActiveLiveChatId,
  ChannelId,
  LiveChatId,
  LiveChatItemId,
  VideoId,
} from "./main/youtubeApi/model";

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

export interface ChatAuthor {
  channelId: ChannelId;
  name: string;
  profileImageUrl: string;
  isMembership: boolean;
  isOwner: boolean;
  isModerator: boolean;
}

export interface ChatCommonPart {
  id: LiveChatItemId;
  author: ChatAuthor;
  publishedAt: Date;
  displayMessage: string;
  /**
   * HH:mm:ss style time format
   */
  formattedTimeString: string;
}

export interface FirstMarkable {
  /**
   * `true` means this is first chat for its author.
   */
  isFirst: boolean;
}

export type TextMessageChat = ChatCommonPart & { type: "text" };

/**
 * Append some data.
 */
export type ExtendedChatItemText = TextMessageChat &
  FirstMarkable & {
    /**
     * index which means position of whole text chat list.
     */
    indexOfWhole: number;

    /**
     * `true` means this is stocked by streamer.
     */
    isStocked: boolean;

    /**
     * `true` means this is focused by streamer.
     */
    isFocused: boolean;
  };

export type SuperChat = ChatCommonPart & {
  type: "superChat";
  amount: string;
  userComment: string;
  tier: Color;
};

export type ExtendedChatItemSuperChat = SuperChat &
  FirstMarkable & {
    isFocused: boolean;
  };

export type SuperSticker = ChatCommonPart & {
  type: "superSticker";
  sticker: {
    stickerId: string;
    altText: string;
  };
  amount: string;
  tier: Color;
};

export type ExtendedChatItemSuperSticker = SuperSticker &
  FirstMarkable & {
    isFocused: boolean;
  };

export type ExtendedSuperItem = ExtendedChatItemSuperChat | ExtendedChatItemSuperSticker;

export type NewMembership = ChatCommonPart & {
  type: "newMembership";
  memberLevelName: string;
  isUpgrade: boolean;
};

export type MembershipMilestone = ChatCommonPart & {
  type: "milestone";
  userComment: string;
  memberMonth: number;
  memberLevelName: string;
};

export type MembershipGift = ChatCommonPart & {
  type: "gift";
  giftCount: number;
  giftMemberLevelName: string;
};

export type GiftReceived = ChatCommonPart & {
  type: "giftReceived";
  receivedMemberLevelName: string;
  gifterChannelId: ChannelId;
  associatedItemId: LiveChatItemId;
};

export type MembershipAndGiftItem =
  | NewMembership
  | MembershipMilestone
  | MembershipGift
  | GiftReceived;

export type UserBannedEternalChatEvent = ChatCommonPart & {
  type: "userBannedEternal";
  bannedUser: {
    channelId: ChannelId;
    name: string;
    profileImageUrl: string;
  };
};

export type UserBannedTemporaryChatEvent = ChatCommonPart & {
  type: "userBannedTemporary";
  bannedUser: {
    channelId: ChannelId;
    name: string;
    profileImageUrl: string;
  };
  durationSec: number;
};

export type UserBannedChatEvent = UserBannedEternalChatEvent | UserBannedTemporaryChatEvent;

export type MessageDeletedChatEvent = ChatCommonPart & {
  type: "messageDeleted";
  deletedMessageId: LiveChatItemId;
};

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

export const Blue = {
  level: 1,
  label: "BLUE",
  hex: "1e88e5",
} as const;

export const LightBlue = {
  level: 2,
  label: "LIGHT BLUE",
  hex: "00e5ff",
} as const;

export const YellowGreen = {
  level: 3,
  label: "YELLOW GREEN",
  hex: "1de9b6",
} as const;

export const Yellow = {
  level: 4,
  label: "YELLOW",
  hex: "ffca28",
} as const;

export const Orange = {
  level: 5,
  label: "ORANGE",
  hex: "f57c00",
} as const;

export const Magenta = {
  level: 6,
  label: "MAGENTA",
  hex: "e91e63",
} as const;

export const Red = {
  level: 7,
  label: "RED",
  hex: "e62117",
} as const;

export const Colors: Color[] = [Blue, LightBlue, YellowGreen, Yellow, Orange, Magenta, Red];

export type Color =
  | typeof Blue
  | typeof LightBlue
  | typeof YellowGreen
  | typeof Yellow
  | typeof Orange
  | typeof Magenta
  | typeof Red;

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
