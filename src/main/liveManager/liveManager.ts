import { LiveLaunchProperties } from "../../types/liveLaunchProperties";
import { ChannelDataFetcher } from "./dataFetcher/channelDataFetcher";
import { VideoDataFetcher } from "./dataFetcher/videoDataFetcher";
import { DataSource } from "./dataSource";
import { Processor } from "./processor";

export class LiveManager {
  readonly #liveLaunchProperties: LiveLaunchProperties;
  readonly #dataSource: DataSource;
  readonly #processor: Processor;
  readonly #channelDataFetcher: ChannelDataFetcher;
  readonly #videoDataFetcher: VideoDataFetcher;
  constructor(
    liveLaunchProperties: LiveLaunchProperties,
    dataSource: DataSource,
    processor: Processor,
    channelDataFetcher: ChannelDataFetcher,
    videoDataFetcher: VideoDataFetcher,
  ) {
    this.#liveLaunchProperties = liveLaunchProperties;
    this.#dataSource = dataSource;
    this.#processor = processor;
    this.#channelDataFetcher = channelDataFetcher;
    this.#videoDataFetcher = videoDataFetcher;
  }
  async setup() {
    await Promise.all([this.#setupChannelDataFetcher(), this.#setupVideoDataFetcher()]);
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

  close() {
    this.#channelDataFetcher.close();
    this.#videoDataFetcher.close();
  }
}
