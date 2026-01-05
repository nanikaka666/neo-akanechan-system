/**
 * Image data structure in Youtube Api Response.
 */
export interface Image {
  url: string;
  width: number;
  height: number;
}

/**
 * Channel data structure in Youtube Api Response.
 */
export interface Channel {
  id: ChannelId;
  snippet?: {
    title: string;
    description: string;
    customUrl: string;
    publishedAt: Date;
    thumbnails: {
      default: Image;
      medium: Image;
      high: Image;
    };
  };
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
