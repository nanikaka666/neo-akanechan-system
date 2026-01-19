import { FocusedOnChatItem, NonMarkedExtendedChatItemText } from "../../types/liveChatItem";
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

  async #setupChannelDataFetcher() {
    this.#channelDataFetcher.removeAllListeners();
    this.#channelDataFetcher.once("start", (initialValue) => {
      console.log("ChannelDataFetcher started.");
      this.#processor.subscriberCount(initialValue);
    });
    this.#channelDataFetcher.once("end", () => {
      console.log("ChannelDataFetcher finished.");
    });
    this.#channelDataFetcher.on("error", console.log);
    this.#channelDataFetcher.on("nextSubscriberCount", (nextSubscriberCount) => {
      this.#processor.subscriberCount(nextSubscriberCount);
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
      this.#processor.likeCount(nextLikeCount);
    });
    this.#videoDataFetcher.on("nextViewerCount", (nextViewerCount) => {
      this.#processor.viewerCount(nextViewerCount);
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

    this.#liveChatDataFetcher.on("text", (item) => this.#processor.textChat(item));
    this.#liveChatDataFetcher.on("superChat", (item) => this.#processor.superChat(item));
    this.#liveChatDataFetcher.on("superSticker", (item) => this.#processor.superSticker(item));
    this.#liveChatDataFetcher.on("newSponsor", (item) => this.#processor.newMembership(item));
    this.#liveChatDataFetcher.on("memberMilestoneChat", (item) =>
      this.#processor.membershipMilestone(item),
    );
    this.#liveChatDataFetcher.on("membershipGifting", (item) =>
      this.#processor.membershipGift(item),
    );
    this.#liveChatDataFetcher.on("giftMembershipReceived", (item) =>
      this.#processor.giftReceived(item),
    );
    this.#liveChatDataFetcher.on("messageDeleted", (item) => this.#processor.messageDeleted(item));
    this.#liveChatDataFetcher.on("userBanned", (item) => this.#processor.bannedUser(item));

    return this.#liveChatDataFetcher.start();
  }

  actionAddStock(item: NonMarkedExtendedChatItemText) {
    this.#processor.addStock(item);
  }

  actionRemoveStock(item: NonMarkedExtendedChatItemText) {
    this.#processor.removeStock(item);
  }

  actionSetFocus(item: FocusedOnChatItem) {
    this.#processor.setFocus(item);
  }

  actionUnsetFocus() {
    this.#processor.unsetFocus();
  }

  close() {
    this.#channelDataFetcher.close();
    this.#videoDataFetcher.close();
    this.#liveChatDataFetcher.close();
  }
}
