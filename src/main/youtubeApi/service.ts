import {
  Channel,
  NotLiveVideo,
  VideoFinishedLive,
  VideoInLive,
  VideoUpcomingLive,
  YoutubeLive,
  YoutubeLiveInLive,
  YoutubeLiveInReady,
  YoutubeVideo,
} from "../../ipcEvent";
import { getAccessToken, revokeCredentials } from "../auth/google";
import {
  ChannelResponse,
  LiveBroadcastYoutubeApiResponse,
  VideoYoutubeApiResponse,
  YoutubeApiClient,
} from "./client";
import { ChannelId, VideoId } from "./model";

export const YoutubeApiService = {
  getChannelOfMine: async () => {
    const accessToken = await googleAccessToken();
    const res = await YoutubeApiClient.getChannelOfMine(accessToken);

    if (!res) {
      // if channel not found, this youtube account doesn't have channel.
      // So revoke it.
      await revokeCredentials();
      return undefined;
    }

    return convertToChannel(res);
  },

  getChannel: async (channelIdish: string) => {
    if (channelIdish === "") {
      throw new Error("Empty text");
    }
    if (channelIdish.length > 30) {
      throw new Error("Too long string.");
    }

    const accessToken = await googleAccessToken();

    const res = channelIdish.startsWith("@")
      ? await YoutubeApiClient.getChannelByHandle(accessToken, channelIdish)
      : await YoutubeApiClient.getChannelById(accessToken, new ChannelId(channelIdish));

    return res ? convertToChannel(res) : undefined;
  },

  getNotFinishedLivesOfMine: async () => {
    const accessToken = await googleAccessToken();

    return (await YoutubeApiClient.getLiveBroadcasts(accessToken))
      .filter((item) => item.snippet.actualEndTime === undefined)
      .map(convertToLive);
  },

  getVideo: async (videoId: VideoId) => {
    const accessToken = await googleAccessToken();

    const res = await YoutubeApiClient.getVideo(accessToken, videoId);

    return res ? convertToVideo(res) : undefined;
  },
};

async function googleAccessToken() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Access Token unavailable.");
  }
  return accessToken;
}

/**
 * Convert to app domain model from Youtube api response domain.
 */
function convertToChannel(res: ChannelResponse): Channel {
  return {
    id: res.id,
    title: res.snippet.title,
    subscribersCount: res.statistics.subscriberCount,
    ownerIconUrl: res.snippet.thumbnails.default.url,
    bannerUrl: res.brandingSettings.image?.bannerExternalUrl,
  } satisfies Channel;
}

/**
 * Convert to app domain model from Youtube api response domain.
 */
function convertToLive(res: LiveBroadcastYoutubeApiResponse): YoutubeLive {
  if (res.snippet.actualEndTime) {
    throw new Error("completed live can not be converted.");
  }
  return res.snippet.actualStartTime
    ? ({
        type: "inLive",
        videoId: res.videoId,
        liveChatId: res.snippet.liveChatId,
        title: res.snippet.title,
        thumbnailUrl: res.snippet.thumbnails.default.url,
        scheduledStartTime: res.snippet.scheduledStartTime,
        actualStartTime: res.snippet.actualStartTime,
        isPublic: res.status.privacyStatus === "public",
      } satisfies YoutubeLiveInLive)
    : ({
        type: "inReady",
        videoId: res.videoId,
        liveChatId: res.snippet.liveChatId,
        title: res.snippet.title,
        thumbnailUrl: res.snippet.thumbnails.default.url,
        scheduledStartTime: res.snippet.scheduledStartTime,
        isPublic: res.status.privacyStatus === "public",
      } satisfies YoutubeLiveInReady);
}

/**
 * Convert to app domain model from Youtube api response domain.
 */
function convertToVideo(res: VideoYoutubeApiResponse): YoutubeVideo {
  if (!("liveStreamingDetails" in res)) {
    return {
      type: "notLive",
      id: res.id,
      title: res.snippet.title,
      description: res.snippet.description,
      channelId: res.snippet.channelId,
      channelTitle: res.snippet.channelTitle,
      thumbnailUrl: res.snippet.thumbnails.default.url,
      likeCount: res.statistics.likeCount,
    } satisfies NotLiveVideo;
  }
  if (res.snippet.liveBroadcastContent === "none") {
    return {
      type: "finishedLive",
      id: res.id,
      title: res.snippet.title,
      description: res.snippet.description,
      channelId: res.snippet.channelId,
      channelTitle: res.snippet.channelTitle,
      thumbnailUrl: res.snippet.thumbnails.default.url,
      likeCount: res.statistics.likeCount,
      actualStartTime: res.liveStreamingDetails!.actualStartTime!,
      actualEndTime: res.liveStreamingDetails!.actualEndTime!,
    } satisfies VideoFinishedLive;
  } else if (res.snippet.liveBroadcastContent === "upcoming") {
    return {
      type: "upcomingLive",
      id: res.id,
      title: res.snippet.title,
      description: res.snippet.description,
      channelId: res.snippet.channelId,
      channelTitle: res.snippet.channelTitle,
      thumbnailUrl: res.snippet.thumbnails.default.url,
      likeCount: res.statistics.likeCount,
      scheduledStartTime: res.liveStreamingDetails!.scheduledStartTime!,
      activeLiveChatId: res.liveStreamingDetails!.activeLiveChatId!,
    } satisfies VideoUpcomingLive;
  } else {
    return {
      type: "inLive",
      id: res.id,
      title: res.snippet.title,
      description: res.snippet.description,
      channelId: res.snippet.channelId,
      channelTitle: res.snippet.channelTitle,
      thumbnailUrl: res.snippet.thumbnails.default.url,
      likeCount: res.statistics.likeCount,
      actualStartTime: res.liveStreamingDetails!.actualStartTime!,
      activeLiveChatId: res.liveStreamingDetails!.activeLiveChatId!,
      concurrentViewers: res.liveStreamingDetails!.concurrentViewers,
    } satisfies VideoInLive;
  }
}
