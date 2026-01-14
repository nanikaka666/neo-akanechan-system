import { Channel, YoutubeLive } from "./ipcEvent";
import { UserSettings } from "./userSettings";

export interface LiveLaunchProperties {
  channel: Channel;
  live: YoutubeLive;
  settings: UserSettings;
  overlayWindowTitle: string;
}
