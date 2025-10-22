import { ChannelId, ChannelTitle, VideoTitle } from "youtube-live-scraper";

export interface ChannelSummary {
  channelId: ChannelId;
  channelTitle: ChannelTitle;
  subscribersCount: number;
  ownerIcon: string;
}

export interface ChannelTop {
  channel: {
    channelId: ChannelId;
    channelTitle: ChannelTitle;
    subscribersCount: number;
    ownerIcon: string;
    channelBanner?: string;
  };
  closestLive?: {
    title: VideoTitle;
    thumbnail: string;
    isOnAir: boolean;
  };
}

/**
 * Ipc channel interfaces.
 *
 * key represents channel name.
 */
export interface IpcEvent {
  /**
   * this event will be fired when need to check channel id.
   * "check" means confirm of existing or fetch data about the channel.
   *
   * if the channel was not found match to `inputChannelId`, `undefined` will be returned.
   */
  confirmInputChannelId: (inputChannelId: ChannelId) => ChannelSummary | undefined;

  /**
   * Get the main channel id (in Youtube ID style).
   */
  getMainChannelId: () => ChannelId | undefined;

  /**
   * Register new channel, and mark as main channel.
   *
   * if given channelId was already registered, `false` will be returnd.
   */
  registerChannel: (channelId: ChannelId) => boolean;

  /**
   * Tell a event that changing the main channel.
   *
   * Main channel accepts `undefined`, if this app has no registrated channel id.
   */
  tellNewMainChannelId: (channelId?: ChannelId) => void;

  /**
   * Get data for main channel top page.
   */
  getChannelTop: (channelId: ChannelId) => ChannelTop | undefined;

  /**
   * Confirm to user that overlay feature should starts.
   */
  userConfirmStartOverlay: (channelTop: ChannelTop) => boolean;
}
