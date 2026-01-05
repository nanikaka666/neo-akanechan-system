import axios from "axios";
import { getAccessToken } from "../auth/google";
import { Channel, ChannelId } from "./model";

/**
 * Handle access to Youtube Data and LiveStreaming API
 */
export const YoutubeApiClient = {
  /**
   * Get ChannelId of user's channel.
   */
  getChannelIdOfMine: async () => {
    const accessToken = await googleAccessToken();
    const url = "https://www.googleapis.com/youtube/v3/channels";

    const res = await axios.get(url, {
      params: { mine: true, part: ["id"].join(",") },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.status < 200 || 300 <= res.status) {
      console.log(res);
      return undefined;
    }

    return new ChannelId(res.data.items[0].id);
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
      console.log(res);
      return [];
    }

    return res.data.items.map(buildChannel);
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
      console.log(res);
      return undefined;
    }

    console.log(res.data.items[0]);

    return buildChannel(res.data.items[0]);
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
function buildChannel(item: any): Channel {
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
  } as Channel;
}
