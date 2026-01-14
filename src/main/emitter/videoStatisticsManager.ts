import { LiveLaunchProperties, LiveStatistics } from "../../types/ipcEvent";
import { getLiveStatisticsManager } from "../liveStatistics";
import { VideoStatisticsEmitter } from "./videoStatisticsEmitter";

let emitter: VideoStatisticsEmitter | undefined;

let counts: Pick<
  LiveStatistics,
  "currentLikeCount" | "maxLikeCount" | "currentLiveViewCount" | "maxLiveViewCount"
>;

export function cleanupVideoStatisticsManager() {
  if (emitter !== undefined) {
    emitter.close();
    emitter = undefined;
  }
  counts = {
    currentLikeCount: 0,
    maxLikeCount: 0,
    currentLiveViewCount: 0,
    maxLiveViewCount: 0,
  };
}

export async function setupVideoStatisticsManager(liveLaunchProperties: LiveLaunchProperties) {
  cleanupVideoStatisticsManager();
  emitter = new VideoStatisticsEmitter(liveLaunchProperties.live.videoId);
  emitter.on("start", (initValue) => {
    console.log("VideoStatisticsEmitter started.", initValue);
  });
  emitter.on("end", () => {
    console.log("VideoStatisticsEmitter finished.");
  });
  emitter.on("error", (error) => {
    console.log(error);
  });
  emitter.on("nextLikeCount", (nextLikeCount) => {
    console.log(`Next Like Count: ${nextLikeCount}`);
    counts.currentLikeCount = nextLikeCount;
    if (counts.maxLikeCount < nextLikeCount) {
      counts.maxLikeCount = nextLikeCount;
      // todo: check reach the goals.
    }
    getLiveStatisticsManager().updateLiveStatistics(counts);
  });
  emitter.on("nextViewerCount", (nextViewerCount) => {
    console.log(`Next Viewer Count: ${nextViewerCount}`);
    counts.currentLiveViewCount = nextViewerCount;
    if (counts.maxLiveViewCount < nextViewerCount) {
      counts.maxLiveViewCount = nextViewerCount;
      // todo: check reach the goals.
    }
    getLiveStatisticsManager().updateLiveStatistics(counts);
  });
  await emitter.start();
}
