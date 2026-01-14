import { YoutubeLive } from "./youtubeLive";
import { Channel } from "./youtubeChannel";
import { UserSettings } from "./userSettings";

export interface LiveLaunchProperties {
  channel: Channel;
  live: YoutubeLive;
  settings: UserSettings;
  overlayWindowTitle: string;
}
