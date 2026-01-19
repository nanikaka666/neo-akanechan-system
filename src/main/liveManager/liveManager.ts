import { LiveLaunchProperties } from "../../types/liveLaunchProperties";
import { ChannelDataFetcher } from "./dataFetcher/channelDataFetcher";
import { DataSource } from "./dataSource";
import { Processor } from "./processor";

export class LiveManager {
  readonly #liveLaunchProperties: LiveLaunchProperties;
  readonly #dataSource: DataSource;
  readonly #processor: Processor;
  readonly #channelDataFetcher: ChannelDataFetcher;
  constructor(
    liveLaunchProperties: LiveLaunchProperties,
    dataSource: DataSource,
    processor: Processor,
    channelDataFetcher: ChannelDataFetcher,
  ) {
    this.#liveLaunchProperties = liveLaunchProperties;
    this.#dataSource = dataSource;
    this.#processor = processor;
    this.#channelDataFetcher = channelDataFetcher;
  }
  async setup() {
    await this.#setupChannelDataFetcher();
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
    await this.#channelDataFetcher.start();
  }

  close() {
    this.#channelDataFetcher.close();
  }
}
