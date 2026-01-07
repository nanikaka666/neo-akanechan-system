import { EventEmitter } from "events";
import TypedEmitter from "typed-emitter";
import { ActiveLiveChatId, LiveChatId } from "../youtubeApi/model";
import { V3DataLiveChatMessageServiceClient } from "../grpc/generated/proto/stream_list_grpc_pb";
import { credentials, Metadata } from "@grpc/grpc-js/build/src";
import {
  LiveChatMessageListRequest,
  LiveChatMessageListResponse,
} from "../grpc/generated/proto/stream_list_pb";
import { getAccessToken } from "../auth/google";

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

  async #execute() {
    let num = 0;
    const typeMap: Record<string, string> = {
      0: "Invalid",
      1: "TEXT_MESSAGE_EVENT: 1;",
      2: "TOMBSTONE: 2;",
      3: "FAN_FUNDING_EVENT: 3;",
      4: "CHAT_ENDED_EVENT: 4;",
      5: "SPONSOR_ONLY_MODE_STARTED_EVENT: 5;",
      6: "SPONSOR_ONLY_MODE_ENDED_EVENT: 6;",
      7: "NEW_SPONSOR_EVENT: 7;",
      17: "MEMBER_MILESTONE_CHAT_EVENT: 17;",
      18: "MEMBERSHIP_GIFTING_EVENT: 18;",
      19: "GIFT_MEMBERSHIP_RECEIVED_EVENT: 19;",
      8: "MESSAGE_DELETED_EVENT: 8;",
      9: "MESSAGE_RETRACTED_EVENT: 9;",
      10: "USER_BANNED_EVENT: 10;",
      15: "SUPER_CHAT_EVENT: 15;",
      16: "SUPER_STICKER_EVENT: 16;",
      20: "POLL_EVENT: 20;",
    };
    while (this.#isActivated) {
      console.log(`Call Num: (${++num})`);
      const [request, metadata] = await this.#buildParams();
      await this.#client.streamList(request, metadata).forEach((data) => {
        const res = data as LiveChatMessageListResponse;

        // export interface TypeMap {
        //   INVALID_TYPE: 0;
        //   TEXT_MESSAGE_EVENT: 1;
        //   TOMBSTONE: 2;
        //   FAN_FUNDING_EVENT: 3;
        //   CHAT_ENDED_EVENT: 4;
        //   SPONSOR_ONLY_MODE_STARTED_EVENT: 5;
        //   SPONSOR_ONLY_MODE_ENDED_EVENT: 6;
        //   NEW_SPONSOR_EVENT: 7;
        //   MEMBER_MILESTONE_CHAT_EVENT: 17;
        //   MEMBERSHIP_GIFTING_EVENT: 18;
        //   GIFT_MEMBERSHIP_RECEIVED_EVENT: 19;
        //   MESSAGE_DELETED_EVENT: 8;
        //   MESSAGE_RETRACTED_EVENT: 9;
        //   USER_BANNED_EVENT: 10;
        //   SUPER_CHAT_EVENT: 15;
        //   SUPER_STICKER_EVENT: 16;
        //   POLL_EVENT: 20;
        // }
        res.getItemsList().forEach((item) => {
          console.log(
            `[${typeMap[item.getSnippet()?.getType() + ""]}] (${item.getAuthorDetails()?.getDisplayName()}) ${item.getSnippet()?.getDisplayMessage()}`,
          );
        });

        const nextPageToken = res.getNextPageToken();
        if (nextPageToken) {
          this.#pageToken = nextPageToken;
        }
        if (res.getOfflineAt()) {
          this.#isActivated = false;
          this.emit("end", "Live becomes finished.");
        }
      });
    }
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
