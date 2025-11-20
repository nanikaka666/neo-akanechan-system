import { LiveLaunchProperties, LiveStatistics } from "../../ipcEvent";
import { LiveViewCountRaisedEventEmitter } from "simple-youtube-emitter";
import { updateLiveStatistics } from "../liveStatistics";

let liveViewCountEmitter: LiveViewCountRaisedEventEmitter | undefined;

let counts: Pick<LiveStatistics, "currentLiveViewCount" | "maxLiveViewCount">;

export async function setupLiveViewCountEmitter(liveLaunchProperties: LiveLaunchProperties) {
  if (liveViewCountEmitter !== undefined) {
    liveViewCountEmitter.close();
    liveViewCountEmitter = undefined;
  }
  liveViewCountEmitter = LiveViewCountRaisedEventEmitter.initWithoutCredential(
    liveLaunchProperties.channel.channel.channelId.id,
    10 * 1000,
  );
  counts = {
    currentLiveViewCount: 0, // todo: upadte this value correctly
    maxLiveViewCount: 0,
  };

  liveViewCountEmitter.on("start", () => {
    console.log("LiveViewCountEmitter started.");
  });
  liveViewCountEmitter.on("end", () => {
    console.log("LiveViewCountEmitter finished.");
  });
  liveViewCountEmitter.on("error", (error) => {
    console.log(error);
  });
  liveViewCountEmitter.on("raised", (before, after) => {
    console.log(`LiveViewCount: ${before.value} -> ${after.value}`);

    counts.maxLiveViewCount = after.value;
    counts.currentLiveViewCount = after.value;

    updateLiveStatistics(counts);
  });

  await liveViewCountEmitter.start();
}
