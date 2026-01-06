import { LiveLaunchProperties, LiveStatistics } from "../../ipcEvent";
import { getLiveStatisticsManager } from "../liveStatistics";
import { ChannelStatisticsEmitter } from "./channelStatisticsEmitter";

let emitter: ChannelStatisticsEmitter | undefined;

export function cleanupChannelStatisticsEmitter() {
  if (emitter !== undefined) {
    emitter.close();
    emitter = undefined;
  }
}

export async function setupChannelStatisticsEmitter(liveLaunchProperties: LiveLaunchProperties) {
  cleanupChannelStatisticsEmitter();
  emitter = new ChannelStatisticsEmitter(liveLaunchProperties.channel.id);
  emitter.on("start", () => {
    console.log("SubscriberCountEmitter started.");
  });
  emitter.on("end", () => {
    console.log("SubscriberCountEmitter finished.");
  });
  emitter.on("error", (error) => {
    console.log(error);
  });
  emitter.on("subscriberCountRaised", (before, after) => {
    console.log(`Subscriber count: ${before} -> ${after}`);

    getLiveStatisticsManager().updateLiveStatistics({ maxSubscriberCount: after } satisfies Pick<
      LiveStatistics,
      "maxSubscriberCount"
    >);
  });
  emitter.on("nextSubscriberCount", (value) => {
    getLiveStatisticsManager().updateLiveStatistics({
      currentSubscriberCount: value,
    } satisfies Pick<LiveStatistics, "currentSubscriberCount">);
  });

  await emitter.start();
}
