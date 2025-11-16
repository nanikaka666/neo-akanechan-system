import { LikeCountRaisedEventEmitter } from "simple-youtube-emitter";
import { LiveLaunchProperties } from "../../ipcEvent";

let likeCountEmitter: LikeCountRaisedEventEmitter | undefined;

export async function setupLikeCountEmitter(liveLaunchProperties: LiveLaunchProperties) {
  if (likeCountEmitter !== undefined) {
    likeCountEmitter.close();
  }
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
  });
  await likeCountEmitter.start();
}
