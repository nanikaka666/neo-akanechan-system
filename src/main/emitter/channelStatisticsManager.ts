import { LiveLaunchProperties } from "../../types/liveLaunchProperties";
import { LiveStatistics } from "../../types/liveStatistics";
import { getLiveStatisticsManager } from "../liveManager/dataSource/liveStatistics";
import { ChannelDataFetcher } from "../liveManager/dataFetcher/channelDataFetcher";

let emitter: ChannelDataFetcher | undefined;
let counts: Pick<LiveStatistics, "currentSubscriberCount" | "maxSubscriberCount">;

export function cleanupChannelStatisticsManager() {
  if (emitter !== undefined) {
    emitter.close();
    emitter = undefined;
  }
  counts = {
    currentSubscriberCount: 0,
    maxSubscriberCount: 0,
  };
}

export async function setupChannelStatisticsManager(liveLaunchProperties: LiveLaunchProperties) {
  cleanupChannelStatisticsManager();
  emitter = new ChannelDataFetcher(liveLaunchProperties.channel.id, 60 * 1000);
  emitter.on("start", (initialValue) => {
    console.log("ChannelStatisticsEmitter started. " + initialValue);
    counts.currentSubscriberCount = initialValue;
    counts.maxSubscriberCount = initialValue;
    getLiveStatisticsManager().updateLiveStatistics(counts);
  });
  emitter.on("end", () => {
    console.log("ChannelStatisticsEmitter finished.");
  });
  emitter.on("error", (error) => {
    console.log(error);
  });
  emitter.on("nextSubscriberCount", (value) => {
    console.log(`Next subscriber count: ${value}`);
    counts.currentSubscriberCount = value;
    if (counts.maxSubscriberCount < value) {
      counts.maxSubscriberCount = value;

      // todo: Subscriber Count Raised here
    }
    getLiveStatisticsManager().updateLiveStatistics(counts);
  });

  await emitter.start();
}
