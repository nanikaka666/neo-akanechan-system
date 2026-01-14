import { ChannelId, LiveChatItemId } from "./youtubeDomainModel";

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

export interface Stockable {
  /**
   * `true` means this is stocked by owner.
   */
  isStocked: boolean;
}

export interface Focusable {
  /**
   * `true` means this is focused by owner.
   */
  isFocused: boolean;
}

export type TextMessageChat = ChatCommonPart & { type: "text" };

/**
 * Append some data.
 */
export type ExtendedChatItemText = TextMessageChat &
  FirstMarkable &
  Stockable &
  Focusable & {
    /**
     * index which means position of whole text chat list.
     */
    indexOfWhole: number;
  };

export type SuperChat = ChatCommonPart & {
  type: "superChat";
  amount: string;
  userComment: string;
  tier: Color;
};

export type ExtendedChatItemSuperChat = SuperChat & FirstMarkable & Focusable;

export type SuperSticker = ChatCommonPart & {
  type: "superSticker";
  sticker: {
    stickerId: string;
    altText: string;
  };
  amount: string;
  tier: Color;
};

export type ExtendedChatItemSuperSticker = SuperSticker & FirstMarkable & Focusable;

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
export const Colors: Color[] = [
  Blue,
  LightBlue,
  YellowGreen,
  Yellow,
  Orange,
  Magenta,
  Red,
] as const;
export type Color =
  | typeof Blue
  | typeof LightBlue
  | typeof YellowGreen
  | typeof Yellow
  | typeof Orange
  | typeof Magenta
  | typeof Red;
