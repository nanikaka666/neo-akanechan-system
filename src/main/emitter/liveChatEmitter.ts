import { EventEmitter } from "events";
import TypedEmitter from "typed-emitter";
import { ActiveLiveChatId, LiveChatId } from "../youtubeApi/model";
import { V3DataLiveChatMessageServiceClient } from "../grpc/generated/proto/stream_list_grpc_pb";
import { credentials, Metadata } from "@grpc/grpc-js/build/src";
import {
  LiveChatMessage,
  LiveChatMessageListRequest,
  LiveChatMessageListResponse,
  LiveChatMessageSnippet,
} from "../grpc/generated/proto/stream_list_pb";
import { getAccessToken } from "../auth/google";

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

  #extractCommonPart(item: LiveChatMessage) {
    return {
      id: item.getId(),
      snippet: {
        authorChannelId: item.getSnippet()?.getAuthorChannelId(),
        publishedAt: item.getSnippet()?.getPublishedAt()
          ? new Date(item.getSnippet()!.getPublishedAt()!)
          : undefined,
        displayMessage: item.getSnippet()?.getDisplayMessage(),
      },
      authorDetails: {
        channelId: item.getAuthorDetails()?.getChannelId(),
        channelUrl: item.getAuthorDetails()?.getChannelUrl(),
        displayName: item.getAuthorDetails()?.getDisplayName(),
        profileImageUrl: item.getAuthorDetails()?.getProfileImageUrl(),
        isVerified: item.getAuthorDetails()?.getIsVerified(),
        isChatOwner: item.getAuthorDetails()?.getIsChatOwner(),
        isChatSponsor: item.getAuthorDetails()?.getIsChatSponsor(),
        isChatModerator: item.getAuthorDetails()?.getIsChatModerator(),
      },
    };
  }

  #handleTextMessageEvent(item: LiveChatMessage) {
    this.#checkItemType(item, itemTypeMap.textMessageEvent);

    const data = {
      ...this.#extractCommonPart(item),
      textMessageDetails: {
        messageText: item.getSnippet()?.getTextMessageDetails()?.getMessageText(),
      },
    };

    console.log("Text");
  }

  #handleNewMembershipsEvent(item: LiveChatMessage) {
    this.#checkItemType(item, itemTypeMap.newSponsorEvent);
    const data = {
      ...this.#extractCommonPart(item),
      newSponsorDetails: {
        memberLevelName: item.getSnippet()?.getNewSponsorDetails()?.getMemberLevelName(),
        isUpgrade: item.getSnippet()?.getNewSponsorDetails()?.getIsUpgrade(),
      },
    };

    console.log("NewMembership", data);
  }

  #handleMessageDeletedEvent(item: LiveChatMessage) {
    this.#checkItemType(item, itemTypeMap.messageDeletedEvent);
    const data = {
      ...this.#extractCommonPart(item),
      messageDeletedDetails: {
        deletedMessageId: item.getSnippet()?.getMessageDeletedDetails()?.getDeletedMessageId(),
      },
    };

    console.log("Message Delete", data);
  }

  #handleUserBannedEvent(item: LiveChatMessage) {
    this.#checkItemType(item, itemTypeMap.userBannedEvent);
    const data = {
      ...this.#extractCommonPart(item),
      userBannedDetails: {
        bannedUserDetails: {
          channelId: item
            .getSnippet()
            ?.getUserBannedDetails()
            ?.getBannedUserDetails()
            ?.getChannelId(),
          channelUrl: item
            .getSnippet()
            ?.getUserBannedDetails()
            ?.getBannedUserDetails()
            ?.getChannelUrl(),
          displayName: item
            .getSnippet()
            ?.getUserBannedDetails()
            ?.getBannedUserDetails()
            ?.getDisplayName(),
          profileImageUrl: item
            .getSnippet()
            ?.getUserBannedDetails()
            ?.getBannedUserDetails()
            ?.getProfileImageUrl(),
        },
        banType: item.getSnippet()?.getUserBannedDetails()?.getBanType(),
        banDurationSeconds: item.getSnippet()?.getUserBannedDetails()?.getBanDurationSeconds(),
      },
    };
    console.log("User Banned.", data);
  }

  #handleSuperChatEvent(item: LiveChatMessage) {
    this.#checkItemType(item, itemTypeMap.superChatEvent);
    const data = {
      ...this.#extractCommonPart(item),
      superChatDetails: {
        amountMicros: item.getSnippet()?.getSuperChatDetails()?.getAmountMicros(),
        currency: item.getSnippet()?.getSuperChatDetails()?.getCurrency(),
        amountDisplayString: item.getSnippet()?.getSuperChatDetails()?.getAmountDisplayString(),
        userComment: item.getSnippet()?.getSuperChatDetails()?.getUserComment(),
        tier: item.getSnippet()?.getSuperChatDetails()?.getTier(),
      },
    };

    console.log("SuperChat.", data);
  }

  #handleSuperStickerEvent(item: LiveChatMessage) {
    this.#checkItemType(item, itemTypeMap.superStickerEvent);
    const data = {
      ...this.#extractCommonPart(item),
      superStickerDetails: {
        superStickerMetadata: {
          stickerId: item
            .getSnippet()
            ?.getSuperStickerDetails()
            ?.getSuperStickerMetadata()
            ?.getStickerId(),
          altText: item
            .getSnippet()
            ?.getSuperStickerDetails()
            ?.getSuperStickerMetadata()
            ?.getAltText(),
          language: item
            .getSnippet()
            ?.getSuperStickerDetails()
            ?.getSuperStickerMetadata()
            ?.getAltTextLanguage(),
        },
        amountMicros: item.getSnippet()?.getSuperStickerDetails()?.getAmountMicros(),
        currency: item.getSnippet()?.getSuperStickerDetails()?.getCurrency(),
        amountDisplayString: item.getSnippet()?.getSuperStickerDetails()?.getAmountDisplayString(),
        tier: item.getSnippet()?.getSuperStickerDetails()?.getTier(),
      },
    };

    console.log("SuperSticker.", data);
  }

  #handleMemberMilestoneChatEvent(item: LiveChatMessage) {
    this.#checkItemType(item, itemTypeMap.memberMilestoneChatEvent);
    const data = {
      ...this.#extractCommonPart(item),
      memberMilestoneChatDetails: {
        userComment: item.getSnippet()?.getMemberMilestoneChatDetails()?.getUserComment(),
        memberMonth: item.getSnippet()?.getMemberMilestoneChatDetails()?.getMemberMonth(),
        memberLevelName: item.getSnippet()?.getMemberMilestoneChatDetails()?.getMemberLevelName(),
      },
    };

    console.log("MemberMilestone.", data);
  }

  #handleMembershipGiftEvent(item: LiveChatMessage) {
    this.#checkItemType(item, itemTypeMap.membershipGiftingEvent);
    const data = {
      ...this.#extractCommonPart(item),
      membershipGiftingDetails: {
        giftMembershipsCount: item
          .getSnippet()
          ?.getMembershipGiftingDetails()
          ?.getGiftMembershipsCount(),
        giftMembershipsLevelName: item
          .getSnippet()
          ?.getMembershipGiftingDetails()
          ?.getGiftMembershipsLevelName(),
      },
    };

    console.log("Membership Gift", data);
  }

  #handleMembershipGiftReceivedEvent(item: LiveChatMessage) {
    this.#checkItemType(item, itemTypeMap.giftMembershipReceivedEvent);
    const data = {
      ...this.#extractCommonPart(item),
      giftMembershipReceivedDetails: {
        memberLevelName: item
          .getSnippet()
          ?.getGiftMembershipReceivedDetails()
          ?.getMemberLevelName(),
        gifterChannelId: item
          .getSnippet()
          ?.getGiftMembershipReceivedDetails()
          ?.getGifterChannelId(),
        associatedMembershipGiftingMessageId: item
          .getSnippet()
          ?.getGiftMembershipReceivedDetails()
          ?.getAssociatedMembershipGiftingMessageId(),
      },
    };

    console.log("Gift Received.", data);
  }

  async #execute() {
    let num = 0;
    while (this.#isActivated) {
      console.log(`Call Num: (${++num})`);
      const [request, metadata] = await this.#buildParams();
      await this.#client.streamList(request, metadata).forEach((data) => {
        const res = data as LiveChatMessageListResponse;

        console.log(
          `Total: ${res.getPageInfo()?.getTotalResults()}, Per page: ${res.getPageInfo()?.getResultsPerPage()}`,
        );

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
};
