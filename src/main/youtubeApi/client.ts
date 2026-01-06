import axios from "axios";
import { getAccessToken } from "../auth/google";
import { Channel, YoutubeLive, YoutubeLiveInLive, YoutubeLiveInReady } from "../../ipcEvent";
import { ChannelId, LiveChatId, VideoId } from "./model";

/**
 * Image data structure in Youtube Api Response.
 */
interface ImageYoutubeApiResponse {
  url: string;
  width: number;
  height: number;
}

/**
 * Statistics in Channel data structure in Youtube Api Response.
 */
interface ChannelStatisticsYoutubeApiResponse {
  subscriberCount: number;
}

/**
 * BrandingSettings in Channel data structure in Youtube Api Response.
 */
interface BrandingSettingsYoutubeApiResponse {
  image?: {
    bannerExternalUrl: string;
  };
}

type LifeCycleStatusYoutubeApiResponse =
  | "complete"
  | "created"
  | "live"
  | "liveStarting"
  | "ready"
  | "revoked"
  | "testStarting"
  | "testing";

type PrivacyStatusYoutubeApiResponse = "private" | "public" | "unlisted";

interface LiveBroadcastYoutubeApiResponse {
  videoId: VideoId;
  snippet: {
    publishedAt: Date;
    title: string;
    description: string;
    thumbnails: {
      default: ImageYoutubeApiResponse;
      medium: ImageYoutubeApiResponse;
      high: ImageYoutubeApiResponse;
      standard: ImageYoutubeApiResponse;
      maxres: ImageYoutubeApiResponse;
    };
    scheduledStartTime: Date;
    actualStartTime?: Date;
    actualEndTime?: Date;
    liveChatId: LiveChatId;
  };
  status: {
    lifeCycleStatus: LifeCycleStatusYoutubeApiResponse;
    privacyStatus: PrivacyStatusYoutubeApiResponse;
  };
}

/**
 * Channel data structure in Youtube Api Response.
 */
interface ChannelResponse {
  id: ChannelId;
  snippet: {
    title: string;
    description: string;
    customUrl?: string;
    publishedAt: Date;
    thumbnails: {
      default: ImageYoutubeApiResponse;
      medium: ImageYoutubeApiResponse;
      high: ImageYoutubeApiResponse;
    };
  };
  statistics: ChannelStatisticsYoutubeApiResponse;
  brandingSettings: BrandingSettingsYoutubeApiResponse;
}

/**
 * Handle access to Youtube Data and LiveStreaming API
 */
export const YoutubeApiClient = {
  /**
   * Get Channel of user's channel.
   */
  getChannelOfMine: async () => {
    const accessToken = await googleAccessToken();
    const url = "https://www.googleapis.com/youtube/v3/channels";

    const res = await axios.get(url, {
      params: {
        mine: true,
        part: ["id", "snippet", "statistics", "brandingSettings"].join(","),
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.status < 200 || 300 <= res.status) {
      throw new Error("Get Channels failed.");
    }

    if (res.data.items.length === 0) {
      return undefined;
    }

    return convertToChannel(buildChannelResponse(res.data.items[0]));
  },

  /**
   * Get multiple Channel info.
   */
  getChannels: async (channelIds: ChannelId[]): Promise<Channel[]> => {
    if (channelIds.length === 0) {
      return [];
    }
    if (channelIds.length > 50) {
      throw new Error(`Too many channel ids. Max is 50. Length: ${channelIds.length}`);
    }

    const accessToken = await googleAccessToken();
    const url = "https://www.googleapis.com/youtube/v3/channels";

    const res = await axios.get(url, {
      params: {
        id: channelIds.map((channelId) => channelId.id).join(","),
        part: ["id", "snippet", "statistics", "brandingSettings"].join(","),
        maxResults: channelIds.length,
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.status < 200 || 300 <= res.status) {
      throw new Error("Get Channels failed.");
    }

    return res.data.items.map(buildChannelResponse).map(convertToChannel);
  },

  /**
   * Get Channel info with ChannelId-ish string.
   */
  getChannel: async (channelIdishString: string) => {
    if (channelIdishString === "") {
      throw new Error(`empty string.`);
    }
    if (channelIdishString.length > 30) {
      throw new Error(`Too long channelId. Max is 30.`);
    }

    const filter = channelIdishString.startsWith("@")
      ? { forHandle: channelIdishString }
      : { id: channelIdishString };

    const accessToken = await googleAccessToken();
    const url = "https://www.googleapis.com/youtube/v3/channels";

    const res = await axios.get(url, {
      params: {
        ...filter,
        part: ["id", "snippet", "statistics", "brandingSettings"].join(","),
        maxResults: 1,
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.status < 200 || 300 <= res.status) {
      throw new Error(`Fail api call. ${res.status} : ${res.statusText}`);
    }

    return buildChannelResponse(res.data.items[0]);
  },

  /**
   * Get LiveBroadcasts of user's channel.
   */
  getLiveBroadcasts: async (): Promise<YoutubeLive[]> => {
    const accessToken = await googleAccessToken();
    const url = "https://www.googleapis.com/youtube/v3/liveBroadcasts";

    const res = await axios.get(url, {
      params: {
        mine: true,
        part: ["id", "snippet", "status"].join(","),
        maxResults: 10,
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.status < 200 || 300 <= res.status) {
      console.log(res);
      return [];
    }

    return (res.data.items.map(buildLiveBroadcastResponse) as LiveBroadcastYoutubeApiResponse[])
      .filter((res) => res.snippet.actualEndTime === undefined)
      .map(convertToLive);
  },
};

async function googleAccessToken() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Access Token unavailable.");
  }
  return accessToken;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildChannelResponse(item: any): ChannelResponse {
  const imageInBrandingSettings =
    "image" in item.brandingSettings
      ? { image: { bannerExternalUrl: item.brandingSettings.image.bannerExternalUrl } }
      : {};
  return {
    id: new ChannelId(item.id),
    snippet: {
      title: item.snippet.title,
      description: item.snippet.description,
      customUrl: item.snippet.customUrl,
      publishedAt: new Date(item.snippet.publishedAt),
      thumbnails: item.snippet.thumbnails,
    },
    statistics: {
      subscriberCount: item.statistics.subscriberCount,
    },
    brandingSettings: {
      ...imageInBrandingSettings,
    },
  } satisfies ChannelResponse;
}

/**
 * Convert to app domain model from Youtube api response domain.
 */
function convertToChannel(res: ChannelResponse) {
  return {
    id: res.id,
    title: res.snippet.title,
    subscribersCount: res.statistics.subscriberCount,
    ownerIconUrl: res.snippet.thumbnails.default.url,
    bannerUrl: res.brandingSettings.image?.bannerExternalUrl,
  } satisfies Channel;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildLiveBroadcastResponse(item: any): LiveBroadcastYoutubeApiResponse {
  return {
    videoId: new VideoId(item.id),
    snippet: {
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: new Date(item.snippet.publishedAt),
      thumbnails: item.snippet.thumbnails,
      scheduledStartTime: new Date(item.snippet.scheduledStartTime),
      actualStartTime: item.snippet.actualStartTime
        ? new Date(item.snippet.actualStartTime)
        : undefined,
      actualEndTime: item.snippet.actualEndTime ? new Date(item.snippet.actualEndTime) : undefined,
      liveChatId: item.snippet.liveChatId,
    },
    status: {
      lifeCycleStatus: item.status.lifeCycleStatus,
      privacyStatus: item.status.privacyStatus,
    },
  } satisfies LiveBroadcastYoutubeApiResponse;
}

/**
 * Convert to app domain model from Youtube api response domain.
 */
function convertToLive(res: LiveBroadcastYoutubeApiResponse) {
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
