import { ChannelId, ChannelTitle } from "youtube-live-scraper";

/**
 * Ipc process interfaces.
 *
 * key represents channel name of ipc process.
 */
export interface IpcEvent {
  confirmInputChannelId: (inputChannelId: ChannelId) => ChannelTitle | undefined;
}
