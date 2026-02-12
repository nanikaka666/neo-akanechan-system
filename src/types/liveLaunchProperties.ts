import { YoutubeLive } from "./youtubeLive";
import { Channel } from "./youtubeChannel";

export interface LiveLaunchProperties {
  channel: Channel;
  live: YoutubeLive;
  overlayWindowTitle: string;
}
