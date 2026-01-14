import { VideoId, ChannelId, ActiveLiveChatId } from "./youtubeDomainModel";

export type YoutubeVideo = VideoUpcomingLive | VideoInLive | VideoFinishedLive | NotLiveVideo;
export interface VideoUpcomingLive {
  type: "upcomingLive";
  id: VideoId;
  title: string;
  description: string;
  channelId: ChannelId;
  channelTitle: string;
  thumbnailUrl: string;
  likeCount?: number;
  scheduledStartTime: Date;
  activeLiveChatId: ActiveLiveChatId;
  isPublic: boolean;
}
export interface VideoInLive {
  type: "inLive";
  id: VideoId;
  title: string;
  description: string;
  channelId: ChannelId;
  channelTitle: string;
  thumbnailUrl: string;
  likeCount?: number;
  actualStartTime: Date;
  activeLiveChatId: ActiveLiveChatId;
  concurrentViewers?: number;
  isPublic: boolean;
}
export interface VideoFinishedLive {
  type: "finishedLive";
  id: VideoId;
  title: string;
  description: string;
  channelId: ChannelId;
  channelTitle: string;
  thumbnailUrl: string;
  likeCount?: number;
  actualStartTime: Date;
  actualEndTime: Date;
  isPublic: boolean;
}
export interface NotLiveVideo {
  type: "notLive";
  id: VideoId;
  title: string;
  description: string;
  channelId: ChannelId;
  channelTitle: string;
  thumbnailUrl: string;
  likeCount?: number;
  isPublic: boolean;
}
