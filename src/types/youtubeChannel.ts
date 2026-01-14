import { ChannelId } from "./youtubeDomainModel";

export interface Channel {
  id: ChannelId;
  title: string;
  subscribersCount: number;
  ownerIconUrl: string;
  bannerUrl?: string;
}
