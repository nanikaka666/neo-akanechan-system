import { VideoId, LiveChatId, ActiveLiveChatId } from "./youtubeDomainModel";

export type YoutubeLive = YoutubeLiveInReady | YoutubeLiveInLive;

export interface YoutubeLiveInReady {
  type: "inReady";
  videoId: VideoId;
  liveChatId: LiveChatId | ActiveLiveChatId;
  title: string;
  thumbnailUrl: string;
  scheduledStartTime: Date;
  isPublic: boolean;
}
export interface YoutubeLiveInLive {
  type: "inLive";
  videoId: VideoId;
  liveChatId: LiveChatId | ActiveLiveChatId;
  title: string;
  thumbnailUrl: string;
  actualStartTime: Date;
  isPublic: boolean;
}
