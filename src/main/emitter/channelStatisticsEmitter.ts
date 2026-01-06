import { EventEmitter } from "events";
import TypedEmitter from "typed-emitter";
import { ChannelId } from "../youtubeApi/model";
import { YoutubeApiService } from "../youtubeApi/service";

export class ChannelStatisticsEmitter extends (EventEmitter as new () => TypedEmitter<ChannelStatisticsEvent>) {
  readonly #channelId: ChannelId;
  readonly #pollingInterval: number;
  #isActivated: boolean;
  constructor(channelId: ChannelId) {
    super();
    this.#channelId = channelId;
    this.#pollingInterval = 60 * 1000;
    this.#isActivated = false;
  }

  async #execute() {
    if (!this.#isActivated) {
      return;
    }

    try {
      const res = await YoutubeApiService.getChannel(this.#channelId.id);
      if (res) {
        this.emit("nextSubscriberCount", res.subscribersCount);
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        this.emit("error", e);
      } else {
        this.emit("error", new Error(`Unknown Error: ${e}`));
      }
    } finally {
      setTimeout(() => this.#execute(), this.#pollingInterval);
    }
  }

  async start() {
    if (this.#isActivated) {
      return true;
    }

    const res = await YoutubeApiService.getChannel(this.#channelId.id);
    if (!res) {
      return false;
    }

    setTimeout(() => this.#execute(), this.#pollingInterval);

    this.#isActivated = true;
    this.emit("start", res.subscribersCount);

    return true;
  }

  close() {
    if (!this.#isActivated) {
      return;
    }
    this.#isActivated = false;
    this.emit("end");
  }
}

export type ChannelStatisticsEvent = {
  nextSubscriberCount: (nextSubscriberCount: number) => void;
  start: (initialValue: number) => void;
  end: () => void;
  error: (err: Error) => void;
};
