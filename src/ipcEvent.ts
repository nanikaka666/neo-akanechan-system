import { ChannelId, ChannelTitle, VideoTitle } from "youtube-live-scraper";
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

/**
 * Represents page which first status of this app.
 *
 * User does not any channel yet.
 */
export interface BeginningBlankPage {
  type: "beginningBlank";
}

/**
 * Represents page which user selects a live from registered channels.
 */
export interface LiveSelectionPage {
  type: "liveSelection";
  mainChannelId: ChannelId;
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
export type MainAppPage = BeginningBlankPage | LiveSelectionPage | LiveStandByPage | InLivePage;

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
   * Notify latest 1000 text chats to renderer.
   */
  tellTextChats: (textChats: ExtendedChatItemText[], textChatNum: number) => void;

  /**
   * Notify all superchat and supersticker item to renderer.
   */
  tellSuperChats: (superChats: ExtendedSuperItem[], superChatsNum: number) => void;

  /**
   * Notify all memberships and gifts item to renderer.
   */
  tellMembershipsAndGifts: (
    membershipsAndGifts: ExtendedMembershipAndGiftItem[],
    membershipsAndGiftsNum: number,
  ) => void;

  /**
   * Notify all stocks to renderer.
   */
  tellStocks: (stocks: ExtendedChatItemText[], stocksNum: number) => void;

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
  getInitialMainAppPage: () => BeginningBlankPage | LiveSelectionPage;

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
   * Notify latest focused item.
   *
   * `undefined` means nothing focused item.
   */
  tellFocus: (focus?: FocusedOnChatItem) => void;

  /**
   * Update focus item.
   *
   * `undefined` means focused item will be unfocused.
   */
  updateFocus: (focus?: FocusedOnChatItem) => boolean;
}
