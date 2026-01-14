import { YoutubeLive, YoutubeLiveInLive, YoutubeLiveInReady } from "../types/youtubeLive";
import { Channel } from "../types/youtubeChannel";
import { LiveLaunchProperties } from "../types/liveLaunchProperties";
import { UserSettingsService } from "./userSettings";
import { VideoId } from "../types/youtubeDomainModel";
import { YoutubeApiService } from "./youtubeApi/service";

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

export async function buildLiveLaunchPropertiesForDebug(
  videoId: VideoId,
): Promise<LiveLaunchProperties> {
  const video = await YoutubeApiService.getVideo(videoId);
  if (!video || video.type === "notLive" || video.type === "finishedLive") {
    throw new Error("Invalid video Id");
  }
  if (video.activeLiveChatId === undefined) {
    throw new Error("ActiveLiveChatId is undefined.");
  }

  const live =
    video.type === "inLive"
      ? ({
          type: "inLive",
          videoId: video.id,
          liveChatId: video.activeLiveChatId,
          title: video.title,
          thumbnailUrl: video.thumbnailUrl,
          actualStartTime: video.actualStartTime,
          isPublic: video.isPublic,
        } satisfies YoutubeLiveInLive)
      : ({
          type: "inReady",
          videoId: video.id,
          liveChatId: video.activeLiveChatId,
          title: video.title,
          thumbnailUrl: video.thumbnailUrl,
          scheduledStartTime: video.scheduledStartTime,
          isPublic: video.isPublic,
        } satisfies YoutubeLiveInReady);

  const channel = await YoutubeApiService.getChannel(video.channelId.id);
  if (!channel) {
    throw new Error("Channel not found.");
  }

  const overlayWindowTitle = `*CAPTURE* ${live.title}`;
  return {
    channel: channel,
    live: live,
    settings: UserSettingsService.getUserSettings(),
    overlayWindowTitle: overlayWindowTitle,
  };
}
