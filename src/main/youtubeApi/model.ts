/**
 * Image data structure in Youtube Api Response.
 */
export interface Image {
  url: string;
  width: number;
  height: number;
}

/**
 * Statistics in Channel data structure in Youtube Api Response.
 */
export interface ChannelStatistics {
  subscriberCount: number;
}

/**
 * BrandingSettings in Channel data structure in Youtube Api Response.
 */
export interface BrandingSettings {
  image?: {
    bannerExternalUrl: string;
  };
}

export type LifeCycleStatus =
  | "complete"
  | "created"
  | "live"
  | "liveStarting"
  | "ready"
  | "revoked"
  | "testStarting"
  | "testing";

export type PrivacyStatus = "private" | "public" | "unlisted";

export interface LiveBroadcast {
  videoId: VideoId;
  snippet: {
    publishedAt: Date;
    title: string;
    description: string;
    thumbnails: {
      default: Image;
      medium: Image;
      high: Image;
      standard: Image;
      maxres: Image;
    };
    scheduledStartTime: Date;
    actualStartTime?: Date;
    actualEndTime?: Date;
    liveChatId: LiveChatId;
  };
  status: {
    lifeCycleStatus: LifeCycleStatus;
    privacyStatus: PrivacyStatus;
  };
}

/**
 * Channel data structure in Youtube Api Response.
 */
export interface Channel {
  id: ChannelId;
  snippet: {
    title: string;
    description: string;
    customUrl?: string;
    publishedAt: Date;
    thumbnails: {
      default: Image;
      medium: Image;
      high: Image;
    };
  };
  statistics: ChannelStatistics;
  brandingSettings: BrandingSettings;
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
