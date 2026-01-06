/**
 * Image data structure in Youtube Api Response.
 */
export interface ImageYoutubeApiResponse {
  url: string;
  width: number;
  height: number;
}

/**
 * Statistics in Channel data structure in Youtube Api Response.
 */
export interface ChannelStatisticsYoutubeApiResponse {
  subscriberCount: number;
}

/**
 * BrandingSettings in Channel data structure in Youtube Api Response.
 */
export interface BrandingSettingsYoutubeApiResponse {
  image?: {
    bannerExternalUrl: string;
  };
}

export type LifeCycleStatusYoutubeApiResponse =
  | "complete"
  | "created"
  | "live"
  | "liveStarting"
  | "ready"
  | "revoked"
  | "testStarting"
  | "testing";

export type PrivacyStatusYoutubeApiResponse = "private" | "public" | "unlisted";

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

export class ChannelId {
  readonly id: string;
  constructor(id: string) {
    if (id === "") {
      throw new Error("channelId is empty.");
    }
    if (id.match(/^[0-9a-zA-Z_-]{24}$/) === null) {
      throw new Error(
        "channelId looks like not YouTube handle has invalid format. Or YouTube changed format channelId.",
      );
    }

    this.id = id;
  }
}

export class VideoId {
  readonly id: string;
  constructor(id: string) {
    if (id.match(/^[0-9a-zA-Z_-]{11}$/) === null) {
      throw new Error("invalid format videoId.");
    }

    this.id = id;
  }
}

export class LiveChatId {
  readonly id: string;
  constructor(id: string) {
    if (id.match(/^[0-9a-zA-Z_-]{55}$/) === null) {
      throw new Error("invalid format LiveChatId.");
    }

    this.id = id;
  }
}
