import axios, { AxiosResponse } from "axios";
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

export interface LiveBroadcastYoutubeApiResponse {
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
export interface ChannelResponse {
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
  getChannelOfMine: async (accessToken: string) => {
    const url = "https://www.googleapis.com/youtube/v3/channels";

    const res = await axios.get(url, {
      params: {
        mine: true,
        part: ["id", "snippet", "statistics", "brandingSettings"].join(","),
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    checkStatus(res);

    if (!("items" in res.data)) {
      return undefined;
    }

    return buildChannelResponse(res.data.items[0]);
  },

  getChannelByHandle: async (accessToken: string, handle: string) => {
    if (handle === "") {
      throw new Error(`empty string.`);
    }
    if (!handle.startsWith("@")) {
      throw new Error(`invalid handle format`);
    }
    if (handle.length > 30) {
      throw new Error(`Too long channelId. Max is 30.`);
    }

    const url = "https://www.googleapis.com/youtube/v3/channels";

    const res = await axios.get(url, {
      params: {
        forHandle: handle,
        part: ["id", "snippet", "statistics", "brandingSettings"].join(","),
        maxResults: 1,
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    checkStatus(res);
    if (!("items" in res.data)) {
      return undefined;
    }

    return buildChannelResponse(res.data.items[0]);
  },

  getChannelById: async (accessToken: string, channelId: ChannelId) => {
    const url = "https://www.googleapis.com/youtube/v3/channels";

    const res = await axios.get(url, {
      params: {
        id: channelId.id,
        part: ["id", "snippet", "statistics", "brandingSettings"].join(","),
        maxResults: 1,
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    checkStatus(res);
    if (!("items" in res.data)) {
      return undefined;
    }

    return buildChannelResponse(res.data.items[0]);
  },

  /**
   * Get LiveBroadcasts of user's channel.
   */
  getLiveBroadcasts: async (accessToken: string): Promise<LiveBroadcastYoutubeApiResponse[]> => {
    const url = "https://www.googleapis.com/youtube/v3/liveBroadcasts";

    const res = await axios.get(url, {
      params: {
        mine: true,
        part: ["id", "snippet", "status"].join(","),
        maxResults: 10,
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    checkStatus(res);

    return res.data.items.map(buildLiveBroadcastResponse) as LiveBroadcastYoutubeApiResponse[];
  },
};

function checkStatus(res: AxiosResponse) {
  if (res.status < 200 || 300 <= res.status) {
    throw new Error(`Api call failed. Status(${res.status}). StatusText: (${res.statusText})`);
  }
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
