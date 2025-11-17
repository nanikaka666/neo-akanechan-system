import { WebContents } from "electron";
import { LiveLaunchProperties } from "../../ipcEvent";
import { LiveViewCountRaisedEventEmitter } from "simple-youtube-emitter";
import { WebContentsWrapper } from "../webContentsWrapper";

let liveViewCountEmitter: LiveViewCountRaisedEventEmitter | undefined;
let webContents: WebContents | undefined;

export async function setupLiveViewCountEmitter(
  w: WebContents,
  liveLaunchProperties: LiveLaunchProperties,
) {
  if (liveViewCountEmitter !== undefined) {
    liveViewCountEmitter.close();
    liveViewCountEmitter = undefined;
  }
  liveViewCountEmitter = LiveViewCountRaisedEventEmitter.initWithoutCredential(
    liveLaunchProperties.channel.channel.channelId.id,
    10 * 1000,
  );
  webContents = w;

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
    WebContentsWrapper.send(webContents!, "tellLiveViewCount", after.value);
  });

  await liveViewCountEmitter.start();
}
