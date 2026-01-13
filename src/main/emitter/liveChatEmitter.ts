import { EventEmitter } from "events";
import TypedEmitter from "typed-emitter";
import { ActiveLiveChatId, LiveChatId } from "../youtubeApi/model";
import { V3DataLiveChatMessageServiceClient } from "../grpc/generated/proto/stream_list_grpc_pb";
import { credentials, Metadata, ServerErrorResponse } from "@grpc/grpc-js";
import {
  LiveChatMessage,
  LiveChatMessageListRequest,
  LiveChatMessageListResponse,
} from "../grpc/generated/proto/stream_list_pb";
import { getAccessToken } from "../auth/google";
import { Status } from "@grpc/grpc-js/build/src/constants";

type ItemType =
  | "invalid"
  | "textMessageEvent"
  | "tombstone"
  | "fanFundingEvent"
  | "chatEndedEvent"
  | "sponsorOnlyModeStartedEvent"
  | "sponsorOnlyModeEndedEvent"
  | "newSponsorEvent"
  | "memberMilestoneChatEvent"
  | "membershipGiftingEvent"
  | "giftMembershipReceivedEvent"
  | "messageDeletedEvent"
  | "messageRetractedEvent"
  | "userBannedEvent"
  | "superChatEvent"
  | "superStickerEvent"
  | "pollEvent";

const itemTypeMap: Record<ItemType, number> = {
  invalid: 0,
  textMessageEvent: 1,
  tombstone: 2,
  fanFundingEvent: 3,
  chatEndedEvent: 4,
  sponsorOnlyModeStartedEvent: 5,
  sponsorOnlyModeEndedEvent: 6,
  newSponsorEvent: 7,
  memberMilestoneChatEvent: 17,
  membershipGiftingEvent: 18,
  giftMembershipReceivedEvent: 19,
  messageDeletedEvent: 8,
  messageRetractedEvent: 9,
  userBannedEvent: 10,
  superChatEvent: 15,
  superStickerEvent: 16,
  pollEvent: 20,
};

function isServerErrorResponse(e: Error): e is ServerErrorResponse {
  return "code" in e;
}

export class LiveChatEmitter extends (EventEmitter as new () => TypedEmitter<LiveChatEvent>) {
  readonly #liveChatId: LiveChatId | ActiveLiveChatId;
  #isActivated: boolean;
  #pageToken: string | undefined;
  readonly #client: V3DataLiveChatMessageServiceClient;
  constructor(liveChatId: LiveChatId | ActiveLiveChatId) {
    super();
    this.#liveChatId = liveChatId;
    this.#isActivated = false;
    this.#client = new V3DataLiveChatMessageServiceClient(
      "youtube.googleapis.com:443",
      credentials.createSsl(),
    );
  }

  async #buildParams() {
    const request = new LiveChatMessageListRequest();
    request.setLiveChatId(this.#liveChatId.id);
    request.setPartList(["id", "snippet", "authorDetails"]);
    if (this.#pageToken) {
      request.setPageToken(this.#pageToken);
    }

    const metadata = new Metadata();
    const accessToken = await getAccessToken();
    metadata.set("authorization", `Bearer ${accessToken}`);

    return [request, metadata] as const;
  }

  #checkItemType(item: LiveChatMessage, expected: number) {
    if (item.getSnippet()?.getType() !== expected) {
      throw new Error(
        `LiveChat Handler is wrong. given: ${item.getSnippet()?.getType()}, Expected: ${expected}`,
      );
    }
  }

  #extractCommonPart(item: LiveChatMessage): LiveChatItemCommonPart {
    return {
      id: item.getId()!,
      snippet: {
        authorChannelId: item.getSnippet()!.getAuthorChannelId()!,
        publishedAt: new Date(item.getSnippet()!.getPublishedAt()!),
        displayMessage: item.getSnippet()?.getDisplayMessage() ?? "",
      },
      author: {
        channelId: item.getAuthorDetails()!.getChannelId()!,
        channelUrl: item.getAuthorDetails()!.getChannelUrl()!,
        displayName: item.getAuthorDetails()!.getDisplayName()!,
        profileImageUrl: item.getAuthorDetails()!.getProfileImageUrl()!,
        isVerified: item.getAuthorDetails()!.getIsVerified()!,
        isChatOwner: item.getAuthorDetails()!.getIsChatOwner()!,
        isChatSponsor: item.getAuthorDetails()!.getIsChatSponsor()!,
        isChatModerator: item.getAuthorDetails()!.getIsChatModerator()!,
      },
    };
  }

  #handleTextMessageEvent(item: LiveChatMessage) {
    this.#checkItemType(item, itemTypeMap.textMessageEvent);

    const data = {
      ...this.#extractCommonPart(item),
      textMessageDetails: {
        messageText: item.getSnippet()!.getTextMessageDetails()!.getMessageText()!,
      },
    };

    this.emit("text", data);
  }

  #handleNewMembershipsEvent(item: LiveChatMessage) {
    this.#checkItemType(item, itemTypeMap.newSponsorEvent);
    const data = {
      ...this.#extractCommonPart(item),
      newSponsorDetails: {
        memberLevelName: item.getSnippet()!.getNewSponsorDetails()!.getMemberLevelName()!,
        isUpgrade: item.getSnippet()!.getNewSponsorDetails()!.getIsUpgrade()!,
      },
    };

    this.emit("newSponsor", data);
  }

  #handleMessageDeletedEvent(item: LiveChatMessage) {
    this.#checkItemType(item, itemTypeMap.messageDeletedEvent);
    const data = {
      ...this.#extractCommonPart(item),
      messageDeletedDetails: {
        deletedMessageId: item.getSnippet()!.getMessageDeletedDetails()!.getDeletedMessageId()!,
      },
    };

    this.emit("messageDeleted", data);
  }

  #handleUserBannedEvent(item: LiveChatMessage) {
    this.#checkItemType(item, itemTypeMap.userBannedEvent);
    const data = {
      ...this.#extractCommonPart(item),
      userBannedDetails: {
        bannedUserDetails: {
          channelId: item
            .getSnippet()!
            .getUserBannedDetails()!
            .getBannedUserDetails()!
            .getChannelId()!,
          channelUrl: item
            .getSnippet()!
            .getUserBannedDetails()!
            .getBannedUserDetails()!
            .getChannelUrl()!,
          displayName: item
            .getSnippet()!
            .getUserBannedDetails()!
            .getBannedUserDetails()!
            .getDisplayName()!,
          profileImageUrl: item
            .getSnippet()!
            .getUserBannedDetails()!
            .getBannedUserDetails()!
            .getProfileImageUrl()!,
        },
        banType: item.getSnippet()!.getUserBannedDetails()!.getBanType()!,
        banDurationSeconds: item.getSnippet()!.getUserBannedDetails()!.getBanDurationSeconds()!,
      },
    };

    this.emit("userBanned", data);
  }

  #handleSuperChatEvent(item: LiveChatMessage) {
    this.#checkItemType(item, itemTypeMap.superChatEvent);
    const data = {
      ...this.#extractCommonPart(item),
      superChatDetails: {
        amountMicros: item.getSnippet()!.getSuperChatDetails()!.getAmountMicros()!,
        currency: item.getSnippet()!.getSuperChatDetails()!.getCurrency()!,
        amountDisplayString: item.getSnippet()!.getSuperChatDetails()!.getAmountDisplayString()!,
        userComment: item.getSnippet()!.getSuperChatDetails()!.getUserComment()!,
        tier: item.getSnippet()!.getSuperChatDetails()!.getTier()!,
      },
    };

    this.emit("superChat", data);
  }

  #handleSuperStickerEvent(item: LiveChatMessage) {
    this.#checkItemType(item, itemTypeMap.superStickerEvent);
    const data = {
      ...this.#extractCommonPart(item),
      superStickerDetails: {
        superStickerMetadata: {
          stickerId: item
            .getSnippet()!
            .getSuperStickerDetails()!
            .getSuperStickerMetadata()!
            .getStickerId()!,
          altText: item
            .getSnippet()!
            .getSuperStickerDetails()!
            .getSuperStickerMetadata()!
            .getAltText()!,
          language: item
            .getSnippet()!
            .getSuperStickerDetails()!
            .getSuperStickerMetadata()!
            .getAltTextLanguage()!,
        },
        amountMicros: item.getSnippet()!.getSuperStickerDetails()!.getAmountMicros()!,
        currency: item.getSnippet()!.getSuperStickerDetails()!.getCurrency()!,
        amountDisplayString: item.getSnippet()!.getSuperStickerDetails()!.getAmountDisplayString()!,
        tier: item.getSnippet()!.getSuperStickerDetails()!.getTier()!,
      },
    };

    this.emit("superSticker", data);
  }

  #handleMemberMilestoneChatEvent(item: LiveChatMessage) {
    this.#checkItemType(item, itemTypeMap.memberMilestoneChatEvent);
    const data = {
      ...this.#extractCommonPart(item),
      memberMilestoneChatDetails: {
        userComment: item.getSnippet()!.getMemberMilestoneChatDetails()!.getUserComment()!,
        memberMonth: item.getSnippet()!.getMemberMilestoneChatDetails()!.getMemberMonth()!,
        memberLevelName: item.getSnippet()!.getMemberMilestoneChatDetails()!.getMemberLevelName()!,
      },
    };

    this.emit("memberMilestoneChat", data);
  }

  #handleMembershipGiftEvent(item: LiveChatMessage) {
    this.#checkItemType(item, itemTypeMap.membershipGiftingEvent);
    const data = {
      ...this.#extractCommonPart(item),
      membershipGiftingDetails: {
        giftMembershipsCount: item
          .getSnippet()!
          .getMembershipGiftingDetails()!
          .getGiftMembershipsCount()!,
        giftMembershipsLevelName: item
          .getSnippet()!
          .getMembershipGiftingDetails()!
          .getGiftMembershipsLevelName()!,
      },
    };

    this.emit("membershipGifting", data);
  }

  #handleMembershipGiftReceivedEvent(item: LiveChatMessage) {
    this.#checkItemType(item, itemTypeMap.giftMembershipReceivedEvent);
    const data = {
      ...this.#extractCommonPart(item),
      giftMembershipReceivedDetails: {
        memberLevelName: item
          .getSnippet()!
          .getGiftMembershipReceivedDetails()!
          .getMemberLevelName()!,
        gifterChannelId: item
          .getSnippet()!
          .getGiftMembershipReceivedDetails()!
          .getGifterChannelId()!,
        associatedMembershipGiftingMessageId: item
          .getSnippet()!
          .getGiftMembershipReceivedDetails()!
          .getAssociatedMembershipGiftingMessageId()!,
      },
    };

    this.emit("giftMembershipReceived", data);
  }

  async #execute() {
    let num = 0;
    while (this.#isActivated) {
      if (num % 10 === 0) {
        console.log(`Call Num: (${num})`);
      }
      num++;
      try {
        const [request, metadata] = await this.#buildParams();
        await this.#client.streamList(request, metadata).forEach((data) => {
          const res = data as LiveChatMessageListResponse;

          res.getItemsList().forEach((item) => {
            const itemType = item.getSnippet()?.getType();
            if (itemType === itemTypeMap.invalid) {
              // do nothing.
            } else if (itemType === itemTypeMap.textMessageEvent) {
              this.#handleTextMessageEvent(item);
            } else if (itemType === itemTypeMap.tombstone) {
              // do nothing.
            } else if (itemType === itemTypeMap.fanFundingEvent) {
              // do nothing.
            } else if (itemType === itemTypeMap.chatEndedEvent) {
              // do nothing.
            } else if (itemType === itemTypeMap.sponsorOnlyModeStartedEvent) {
              // do nothing.
            } else if (itemType === itemTypeMap.sponsorOnlyModeEndedEvent) {
              // do nothing.
            } else if (itemType === itemTypeMap.newSponsorEvent) {
              this.#handleNewMembershipsEvent(item);
            } else if (itemType === itemTypeMap.messageDeletedEvent) {
              this.#handleMessageDeletedEvent(item);
            } else if (itemType === itemTypeMap.messageRetractedEvent) {
              // do nothing.
            } else if (itemType === itemTypeMap.userBannedEvent) {
              this.#handleUserBannedEvent(item);
            } else if (itemType === itemTypeMap.superChatEvent) {
              this.#handleSuperChatEvent(item);
            } else if (itemType === itemTypeMap.superStickerEvent) {
              this.#handleSuperStickerEvent(item);
            } else if (itemType === itemTypeMap.memberMilestoneChatEvent) {
              this.#handleMemberMilestoneChatEvent(item);
            } else if (itemType === itemTypeMap.membershipGiftingEvent) {
              this.#handleMembershipGiftEvent(item);
            } else if (itemType === itemTypeMap.giftMembershipReceivedEvent) {
              this.#handleMembershipGiftReceivedEvent(item);
            } else if (itemType === itemTypeMap.pollEvent) {
              // do nothing.
            } else {
              this.emit("error", new Error(`Unknown Item Type Detected. ${itemType}`));
            }
          });

          const nextPageToken = res.getNextPageToken();
          if (nextPageToken) {
            this.#pageToken = nextPageToken;
          }
          if (res.getOfflineAt()) {
            this.#isActivated = false;
          }
        });
      } catch (e: unknown) {
        if (e instanceof Error) {
          this.emit("error", e);
          if (isServerErrorResponse(e)) {
            if (e.code === Status.RESOURCE_EXHAUSTED) {
              // code 8 includes several means.
              // 1. quota beyounds limit.
              // 2. this api so many called frequentially.
              // So, retrying api will end in meaningless, stop the loop.
              this.emit("end", "RESOURCE_EXHAUSTED error returns.");
              this.#isActivated = false;
            } else if (e.code === Status.NOT_FOUND) {
              // code 5 means possibility that given live chat id is invalid.
              // but sequential calling with valid live chat id, sometime returns this error.
              // So, let try next loop even if catch this error.
              // do nothing, go to next loop.
            } else if (e.code === Status.PERMISSION_DENIED) {
              // code 7 means permission denied.
              // So, close the loop immediately.
              this.emit("end", "try to connect a chat without permission.");
              this.#isActivated = false;
            } else if (e.code === Status.INVALID_ARGUMENT) {
              // code 3 means invalid argument.
              // So, close the loop.
              this.emit("end", "try to connect a chat with invalid arguments.");
              this.#isActivated = false;
            } else if (e.code === Status.FAILED_PRECONDITION) {
              // code 9 include multiple meaning, but what app should do is closing the loop whichever.
              this.emit("end", "given chat is already invalid.");
              this.#isActivated = false;
            } else {
              // other error code is not shown up the document.
              // So, app doesn't know best thing how app should do.
              // in site of security, let close the loop.
              this.emit("end", "Appearance of unknown error code.");
              this.#isActivated = false;
            }
          }
        } else {
          this.emit("error", new Error(`${e}`));
        }
        // Wait 11 seconds. And then go to next streamList loop.
        await new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 11 * 1000);
        });
      }
    }
    this.emit("end", "Live becomes finished.");
  }

  start() {
    if (this.#isActivated) {
      return true;
    }

    this.#isActivated = true;
    this.#execute();

    this.emit("start");
    return true;
  }

  close() {
    if (!this.#isActivated) {
      return;
    }
    this.#isActivated = false;
    this.emit("end", "close() is called.");
  }
}

export type LiveChatEvent = {
  start: () => void;
  end: (reason: string) => void;
  error: (err: Error) => void;
  text: (item: LiveChatItemCommonPart & { textMessageDetails: LiveChatItemTextMessage }) => void;
  superChat: (item: LiveChatItemCommonPart & { superChatDetails: LiveChatItemSuperChat }) => void;
  superSticker: (
    item: LiveChatItemCommonPart & { superStickerDetails: LiveChatItemSuperSticker },
  ) => void;
  newSponsor: (
    item: LiveChatItemCommonPart & { newSponsorDetails: LiveChatItemNewSponsor },
  ) => void;
  memberMilestoneChat: (
    item: LiveChatItemCommonPart & { memberMilestoneChatDetails: LiveChatItemMemberMilestoneChat },
  ) => void;
  membershipGifting: (
    item: LiveChatItemCommonPart & { membershipGiftingDetails: LiveChatItemMembershipGifting },
  ) => void;
  giftMembershipReceived: (
    item: LiveChatItemCommonPart & {
      giftMembershipReceivedDetails: LiveChatItemGiftMembershipReceived;
    },
  ) => void;
  messageDeleted: (
    item: LiveChatItemCommonPart & { messageDeletedDetails: LiveChatItemMessageDeleted },
  ) => void;
  userBanned: (
    item: LiveChatItemCommonPart & { userBannedDetails: LiveChatItemUserBanned },
  ) => void;
};

// LiveChat types.
// types in below represents raw response.
// these will be converted as domain model of this app.

export interface LiveChatItemSnippet {
  authorChannelId: string;
  publishedAt: Date;
  displayMessage: string;
}

export interface LiveChatItemAuthor {
  channelId: string;
  channelUrl: string;
  displayName: string;
  profileImageUrl: string;
  isVerified: boolean;
  isChatOwner: boolean;
  isChatSponsor: boolean;
  isChatModerator: boolean;
}

export interface LiveChatItemCommonPart {
  id: string;
  snippet: LiveChatItemSnippet;
  author: LiveChatItemAuthor;
}

export interface LiveChatItemTextMessage {
  messageText: string;
}

export interface LiveChatItemSuperChat {
  amountMicros: number;
  currency: string;
  amountDisplayString: string;
  userComment: string;
  tier: number;
}

export interface LiveChatItemSuperSticker {
  superStickerMetadata: {
    stickerId: string;
    altText: string;
    language: string;
  };
  amountMicros: number;
  currency: string;
  amountDisplayString: string;
  tier: number;
}

export interface LiveChatItemNewSponsor {
  memberLevelName: string;
  isUpgrade: boolean;
}

export interface LiveChatItemMemberMilestoneChat {
  userComment: string;
  memberMonth: number;
  memberLevelName: string;
}

export interface LiveChatItemMembershipGifting {
  giftMembershipsCount: number;
  giftMembershipsLevelName: string;
}

export interface LiveChatItemGiftMembershipReceived {
  memberLevelName: string;
  gifterChannelId: string;
  associatedMembershipGiftingMessageId: string;
}

export interface LiveChatItemUserBanned {
  bannedUserDetails: {
    channelId: string;
    channelUrl: string;
    displayName: string;
    profileImageUrl: string;
  };
  banType: number;
  banDurationSeconds: number;
}

export interface LiveChatItemMessageDeleted {
  deletedMessageId: string;
}
