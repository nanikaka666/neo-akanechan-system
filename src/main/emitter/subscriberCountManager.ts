import { WebContents } from "electron";
import { LiveLaunchProperties } from "../../ipcEvent";
import { SubscriberCountRaisedEventEmitter } from "simple-youtube-emitter";

let subscriberCountEmitter: SubscriberCountRaisedEventEmitter | undefined;
let webContents: WebContents | undefined;

export async function setupSubscriberCountEmitter(
  w: WebContents,
  liveLaunchProperties: LiveLaunchProperties,
) {
  if (subscriberCountEmitter !== undefined) {
    subscriberCountEmitter.close();
    subscriberCountEmitter = undefined;
  }
  subscriberCountEmitter = SubscriberCountRaisedEventEmitter.initWithoutCredential(
    liveLaunchProperties.channel.channel.channelId.id,
    30 * 1000,
  );
  webContents = w;

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
  });

  await subscriberCountEmitter.start();
}
