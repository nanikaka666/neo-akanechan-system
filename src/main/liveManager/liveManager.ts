import {
  FocusedOnChatItem,
  NonMarkedExtendedChatItemText,
  SuperChat,
  SuperSticker,
  TextMessageChat,
} from "../../types/liveChatItem";
import { LiveLaunchProperties } from "../../types/liveLaunchProperties";
import { ChannelDataFetcher } from "./dataFetcher/channelDataFetcher";
import { LiveChatDataFetcher } from "./dataFetcher/liveChatDataFetcher";
import { VideoDataFetcher } from "./dataFetcher/videoDataFetcher";
import { DataSource } from "./dataSource";
import { Processor } from "./processor";

export class LiveManager {
  readonly #liveLaunchProperties: LiveLaunchProperties;
  readonly #dataSource: DataSource;
  readonly #processor: Processor;
  readonly #channelDataFetcher: ChannelDataFetcher;
  readonly #videoDataFetcher: VideoDataFetcher;
  readonly #liveChatDataFetcher: LiveChatDataFetcher;
  constructor(
    liveLaunchProperties: LiveLaunchProperties,
    dataSource: DataSource,
    processor: Processor,
    channelDataFetcher: ChannelDataFetcher,
    videoDataFetcher: VideoDataFetcher,
    liveChatDataFetcher: LiveChatDataFetcher,
  ) {
    this.#liveLaunchProperties = liveLaunchProperties;
    this.#dataSource = dataSource;
    this.#processor = processor;
    this.#channelDataFetcher = channelDataFetcher;
    this.#videoDataFetcher = videoDataFetcher;
    this.#liveChatDataFetcher = liveChatDataFetcher;
  }
  async setup() {
    await Promise.all([this.#setupChannelDataFetcher(), this.#setupVideoDataFetcher()]);
    this.#setupLiveChatDataFetcher();
  }

  /**
   * wrap processor's method calls for error handling.
   * if error thrown, then stop all data fetchers.
   */
  #processorGuard(processorFunction: () => void) {
    try {
      processorFunction();
    } catch (e: unknown) {
      console.log(e);
      this.close();
    }
  }

  async #setupChannelDataFetcher() {
    this.#channelDataFetcher.removeAllListeners();
    this.#channelDataFetcher.once("start", (initialValue) => {
      console.log("ChannelDataFetcher started.");
      this.#processorGuard(() => this.#processor.subscriberCount(initialValue));
    });
    this.#channelDataFetcher.once("end", () => {
      console.log("ChannelDataFetcher finished.");
    });
    this.#channelDataFetcher.on("error", console.log);
    this.#channelDataFetcher.on("nextSubscriberCount", (nextSubscriberCount) => {
      this.#processorGuard(() => this.#processor.subscriberCount(nextSubscriberCount));
    });
    return await this.#channelDataFetcher.start();
  }

  async #setupVideoDataFetcher() {
    this.#videoDataFetcher.removeAllListeners();
    this.#videoDataFetcher.once("start", (initValue) => {
      console.log("VideoDataFetcher started.", initValue);
    });
    this.#videoDataFetcher.once("end", () => {
      console.log("VideoDataFetcher finished.");
    });
    this.#videoDataFetcher.on("error", console.log);
    this.#videoDataFetcher.on("nextLikeCount", (nextLikeCount) => {
      this.#processorGuard(() => this.#processor.likeCount(nextLikeCount));
    });
    this.#videoDataFetcher.on("nextViewerCount", (nextViewerCount) => {
      this.#processorGuard(() => this.#processor.viewerCount(nextViewerCount));
    });
    return await this.#videoDataFetcher.start();
  }

  #setupLiveChatDataFetcher() {
    this.#liveChatDataFetcher.once("start", () => {
      console.log("LiveChatDataFetcher started.");
    });
    this.#liveChatDataFetcher.once("end", (reason) => {
      console.log(`LiveChatDataFetcher finished. reason: ${reason}`);
    });
    this.#liveChatDataFetcher.on("error", console.log);

    this.#liveChatDataFetcher.on("text", (item) =>
      this.#processorGuard(() => this.#processor.textChat(item)),
    );
    this.#liveChatDataFetcher.on("superChat", (item) =>
      this.#processorGuard(() => this.#processor.superChat(item)),
    );
    this.#liveChatDataFetcher.on("superSticker", (item) =>
      this.#processorGuard(() => this.#processor.superSticker(item)),
    );
    this.#liveChatDataFetcher.on("newSponsor", (item) =>
      this.#processorGuard(() => this.#processor.newMembership(item)),
    );
    this.#liveChatDataFetcher.on("memberMilestoneChat", (item) =>
      this.#processorGuard(() => this.#processor.membershipMilestone(item)),
    );
    this.#liveChatDataFetcher.on("membershipGifting", (item) =>
      this.#processorGuard(() => this.#processor.membershipGift(item)),
    );
    this.#liveChatDataFetcher.on("giftMembershipReceived", (item) =>
      this.#processorGuard(() => this.#processor.giftReceived(item)),
    );
    this.#liveChatDataFetcher.on("messageDeleted", (item) =>
      this.#processorGuard(() => this.#processor.messageDeleted(item)),
    );
    this.#liveChatDataFetcher.on("userBanned", (item) =>
      this.#processorGuard(() => this.#processor.bannedUser(item)),
    );

    return this.#liveChatDataFetcher.start();
  }

  actionAddStock(item: NonMarkedExtendedChatItemText) {
    this.#processorGuard(() => this.#processor.addStock(item));
  }

  actionRemoveStock(item: NonMarkedExtendedChatItemText) {
    this.#processorGuard(() => this.#processor.removeStock(item));
  }

  actionSetFocus(item: FocusedOnChatItem) {
    this.#processorGuard(() => this.#processor.setFocus(item));
  }

  actionUnsetFocus() {
    this.#processorGuard(() => this.#processor.unsetFocus());
  }

  actionPlusPoints(item: TextMessageChat | SuperChat | SuperSticker) {
    this.#processorGuard(() => this.#processor.manualPlusPoints(item));
  }

  close() {
    this.#channelDataFetcher.close();
    this.#videoDataFetcher.close();
    this.#liveChatDataFetcher.close();
  }
}
