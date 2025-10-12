import { ChannelId, ChannelTitle } from "youtube-live-scraper";

/**
 * Ipc process interfaces.
 *
 * key represents channel name of ipc process.
 */
export interface IpcEvent {
  /**
   * this event will be fired when need to check channel id.
   * "check" means confirm of existing or fetch data about the channel.
   *
   * if the channel was not found match to `inputChannelId`, `undefined` will be returned.
   */
  confirmInputChannelId: (inputChannelId: ChannelId) => ChannelTitle | undefined;
}
