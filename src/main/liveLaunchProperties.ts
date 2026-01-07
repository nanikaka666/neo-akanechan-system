import { Channel, LiveLaunchProperties, YoutubeLive } from "../ipcEvent";
import { UserSettingsService } from "./userSettings";

export function buildLiveLaunchProperties(
  channel: Channel,
  live: YoutubeLive,
): LiveLaunchProperties {
  // shown on title bar of overlay window.
  const overlayWindowTitle = `*CAPTURE* ${live.title}`;

  return {
    channel: channel,
    live: live,
    settings: UserSettingsService.getUserSettings(),
    overlayWindowTitle: overlayWindowTitle,
  };
}
