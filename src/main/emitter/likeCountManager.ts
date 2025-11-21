import { LikeCountRaisedEventEmitter } from "simple-youtube-emitter";
import { LiveLaunchProperties, LiveStatistics } from "../../ipcEvent";
import { updateLiveStatistics } from "../liveStatistics";

let likeCountEmitter: LikeCountRaisedEventEmitter | undefined;

let counts: Pick<LiveStatistics, "currentLikeCount" | "maxLikeCount">;

export function cleanUpLikeCountEmitter() {
  if (likeCountEmitter !== undefined) {
    likeCountEmitter.close();
    likeCountEmitter = undefined;
  }
  counts = {
    currentLikeCount: 0,
    maxLikeCount: 0,
  };
}

export async function setupLikeCountEmitter(liveLaunchProperties: LiveLaunchProperties) {
  cleanUpLikeCountEmitter();

  counts = {
    currentLikeCount: 0, // todo: update this value correctly
    maxLikeCount: 0,
  };
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
    counts.currentLikeCount = after.value;
    counts.maxLikeCount = after.value;

    updateLiveStatistics(counts);
  });
  await likeCountEmitter.start();
}
