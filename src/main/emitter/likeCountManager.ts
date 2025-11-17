import { LikeCountRaisedEventEmitter } from "simple-youtube-emitter";
import { LiveLaunchProperties } from "../../ipcEvent";
import { WebContents } from "electron";
import { WebContentsWrapper } from "../webContentsWrapper";

let likeCountEmitter: LikeCountRaisedEventEmitter | undefined;
let webContents: WebContents | undefined;

export async function setupLikeCountEmitter(
  w: WebContents,
  liveLaunchProperties: LiveLaunchProperties,
) {
  if (likeCountEmitter !== undefined) {
    likeCountEmitter.close();
  }
  webContents = w;
  likeCountEmitter = LikeCountRaisedEventEmitter.initWithoutCredential(
    liveLaunchProperties.channel.channel.channelId.id,
    10 * 1000,
  );
  likeCountEmitter.on("start", () => {
    console.log("LikeCountEmitter started.");
  });
  likeCountEmitter.on("end", () => {
    console.log("LikeCountEmitter finished.");
  });
  likeCountEmitter.on("error", (error) => {
    console.log(error);
  });
  likeCountEmitter.on("raised", (before, after) => {
    // tell raised value to LCP and overlay.
    // depends on settings, tell reaching goals.
    console.log(`Like Count: ${before.value} -> ${after.value}`);
    WebContentsWrapper.send(webContents!, "tellLikeCount", after.value);
  });
  await likeCountEmitter.start();
}
