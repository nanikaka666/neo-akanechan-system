/**
 * this module contains model converting functions.
 *
 * that does convert from gRPC domain model to app domain model.
 */

import {
  ChatCommonPart,
  Colors,
  GiftReceived,
  MembershipGift,
  MembershipMilestone,
  MessageDeletedChatEvent,
  NewMembership,
  SuperChat,
  SuperSticker,
  TextMessageChat,
  UserBannedChatEvent,
} from "../../types/ipcEvent";
import {
  LiveChatItemCommonPart,
  LiveChatItemGiftMembershipReceived,
  LiveChatItemMemberMilestoneChat,
  LiveChatItemMembershipGifting,
  LiveChatItemMessageDeleted,
  LiveChatItemNewSponsor,
  LiveChatItemSuperChat,
  LiveChatItemSuperSticker,
  LiveChatItemTextMessage,
  LiveChatItemUserBanned,
} from "../emitter/liveChatEmitter";
import { ChannelId, LiveChatItemId } from "./model";

function to2Digit(value: string) {
  return value.length === 1 ? "0" + value : value;
}

function convertFormattedDate(date: Date) {
  const hour = date.getHours() + "";
  const minute = date.getMinutes() + "";
  const second = date.getSeconds() + "";

  return `${to2Digit(hour)}:${to2Digit(minute)}:${to2Digit(second)}`;
}

function convertCommonPart(item: LiveChatItemCommonPart): ChatCommonPart {
  return {
    id: new LiveChatItemId(item.id),
    author: {
      channelId: new ChannelId(item.author.channelId),
      name: item.author.displayName,
      profileImageUrl: item.author.profileImageUrl,
      isMembership: item.author.isChatSponsor,
      isOwner: item.author.isChatOwner,
      isModerator: item.author.isChatModerator,
    },
    publishedAt: item.snippet.publishedAt,
    displayMessage: item.snippet.displayMessage,
    formattedTimeString: convertFormattedDate(item.snippet.publishedAt),
  };
}

export function convertTextItem(item: LiveChatItemTextMessage): TextMessageChat {
  return {
    type: "text",
    ...convertCommonPart(item),
  };
}

export function convertSuperChatItem(item: LiveChatItemSuperChat): SuperChat {
  return {
    type: "superChat",
    ...convertCommonPart(item),
    amount: item.superChatDetails.amountDisplayString,
    userComment: item.superChatDetails.userComment,
    tier: Colors[item.superChatDetails.tier - 1],
  };
}

export function convertSuperStickerItem(item: LiveChatItemSuperSticker): SuperSticker {
  return {
    type: "superSticker",
    ...convertCommonPart(item),
    sticker: {
      stickerId: item.superStickerDetails.superStickerMetadata.stickerId,
      altText: item.superStickerDetails.superStickerMetadata.altText,
    },
    amount: item.superStickerDetails.amountDisplayString,
    tier: Colors[item.superStickerDetails.tier - 1], // @see https://issuetracker.google.com/u/1/issues/474398428
  };
}

export function convertNewMembershipItem(item: LiveChatItemNewSponsor): NewMembership {
  return {
    type: "newMembership",
    ...convertCommonPart(item),
    memberLevelName: item.newSponsorDetails.memberLevelName,
    isUpgrade: item.newSponsorDetails.isUpgrade,
  };
}

export function convertMembershipMilestoneItem(
  item: LiveChatItemMemberMilestoneChat,
): MembershipMilestone {
  return {
    type: "milestone",
    ...convertCommonPart(item),
    userComment: item.memberMilestoneChatDetails.userComment,
    memberMonth: item.memberMilestoneChatDetails.memberMonth,
    memberLevelName: item.memberMilestoneChatDetails.memberLevelName,
  };
}

export function convertMembershipGiftItem(item: LiveChatItemMembershipGifting): MembershipGift {
  return {
    type: "gift",
    ...convertCommonPart(item),
    giftCount: item.membershipGiftingDetails.giftMembershipsCount,
    giftMemberLevelName: item.membershipGiftingDetails.giftMembershipsLevelName,
  };
}

export function convertGiftReceivedItem(item: LiveChatItemGiftMembershipReceived): GiftReceived {
  return {
    type: "giftReceived",
    ...convertCommonPart(item),
    receivedMemberLevelName: item.giftMembershipReceivedDetails.memberLevelName,
    gifterChannelId: new ChannelId(item.giftMembershipReceivedDetails.gifterChannelId),
    associatedItemId: new LiveChatItemId(
      item.giftMembershipReceivedDetails.associatedMembershipGiftingMessageId,
    ),
  };
}

export function convertUserBannedItem(item: LiveChatItemUserBanned): UserBannedChatEvent {
  return item.userBannedDetails.banType === 1
    ? {
        type: "userBannedEternal",
        ...convertCommonPart(item),
        bannedUser: {
          channelId: new ChannelId(item.userBannedDetails.bannedUserDetails.channelId),
          name: item.userBannedDetails.bannedUserDetails.displayName,
          profileImageUrl: item.userBannedDetails.bannedUserDetails.profileImageUrl,
        },
      }
    : {
        type: "userBannedTemporary",
        ...convertCommonPart(item),
        bannedUser: {
          channelId: new ChannelId(item.userBannedDetails.bannedUserDetails.channelId),
          name: item.userBannedDetails.bannedUserDetails.displayName,
          profileImageUrl: item.userBannedDetails.bannedUserDetails.profileImageUrl,
        },
        durationSec: item.userBannedDetails.banDurationSeconds,
      };
}

export function convertMessageDeletedItem(
  item: LiveChatItemMessageDeleted,
): MessageDeletedChatEvent {
  return {
    type: "messageDeleted",
    ...convertCommonPart(item),
    deletedMessageId: new LiveChatItemId(item.messageDeletedDetails.deletedMessageId),
  };
}
