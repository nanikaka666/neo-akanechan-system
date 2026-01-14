import { EventEmitter } from "events";
import TypedEmitter from "typed-emitter";
import { VideoId } from "../../types/youtubeDomainModel";
import { YoutubeApiService } from "../youtubeApi/service";
import { YoutubeVideo } from "../../types/youtubeVideo";

export class VideoStatisticsEmitter extends (EventEmitter as new () => TypedEmitter<VideoStatisticsEvent>) {
  readonly #videoId: VideoId;
  readonly #pollingInterval: number;
  #isActivated: boolean;
  constructor(videoId: VideoId) {
    super();
    this.#videoId = videoId;
    this.#pollingInterval = 15 * 1000;
    this.#isActivated = false;
  }

  async #execute() {
    if (!this.#isActivated) {
      return;
    }

    try {
      const res = await YoutubeApiService.getVideo(this.#videoId);
      if (res) {
        if (res.likeCount !== undefined) {
          this.emit("nextLikeCount", res.likeCount);
        }
        if (res.type === "inLive" && res.concurrentViewers !== undefined) {
          this.emit("nextViewerCount", res.concurrentViewers);
        }
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

    const res = await YoutubeApiService.getVideo(this.#videoId);
    if (!res) {
      return false;
    }

    setTimeout(() => this.#execute(), this.#pollingInterval);

    this.#isActivated = true;
    this.emit("start", res);

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

export type VideoStatisticsEvent = {
  nextLikeCount: (nextLikeCount: number) => void;
  nextViewerCount: (nextViewerCount: number) => void;
  start: (initValue: YoutubeVideo) => void;
  end: () => void;
  error: (err: Error) => void;
};
