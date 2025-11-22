import { LiveLaunchProperties, LiveStatistics } from "../../ipcEvent";
import { SubscriberCountRaisedEventEmitter } from "simple-youtube-emitter";
import { updateLiveStatistics } from "../liveStatistics";

let subscriberCountEmitter: SubscriberCountRaisedEventEmitter | undefined;

let counts: Pick<LiveStatistics, "currentSubscriberCount" | "maxSubscriberCount">;

export function cleanUpSubscriberCountEmitter() {
  if (subscriberCountEmitter !== undefined) {
    subscriberCountEmitter.close();
    subscriberCountEmitter = undefined;
  }
  counts = {
    currentSubscriberCount: 0,
    maxSubscriberCount: 0,
  };
}

export async function setupSubscriberCountEmitter(liveLaunchProperties: LiveLaunchProperties) {
  cleanUpSubscriberCountEmitter();
  counts = {
    currentSubscriberCount: 0, // todo: update this value correctly
    maxSubscriberCount: 0,
  };
  subscriberCountEmitter = SubscriberCountRaisedEventEmitter.initWithoutCredential(
    liveLaunchProperties.channel.channel.channelId.id,
    30 * 1000,
  );

  subscriberCountEmitter.on("start", () => {
    console.log("SubscriberCountEmitter started.");
  });
  subscriberCountEmitter.on("end", () => {
    console.log("SubscriberCountEmitter finished.");
  });
  subscriberCountEmitter.on("error", (error) => {
    console.log(error);
  });
  subscriberCountEmitter.on("raised", (before, after) => {
    console.log(`Subscriber count: ${before.value} -> ${after.value}`);
    counts.maxSubscriberCount = after.value;
    counts.currentSubscriberCount = after.value;

    updateLiveStatistics(counts);
  });

  await subscriberCountEmitter.start();
}
