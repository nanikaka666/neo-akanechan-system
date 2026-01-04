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
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error("Access Token unavailable.");
    }
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

  getChannels: async (channelIds: ChannelId[]) => {
    if (channelIds.length === 0) {
      return [];
    }
    if (channelIds.length > 50) {
      throw new Error(`Too many channel ids. Max is 50. Length: ${channelIds.length}`);
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error("Access Token unavailable.");
    }
    const url = "https://www.googleapis.com/youtube/v3/channels";

    const res = await axios.get(url, {
      params: {
        id: channelIds.map((channelId) => channelId.id).join(","),
        part: ["id", "snippet"].join(","),
        maxResults: channelIds.length,
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.status < 200 || 300 <= res.status) {
      console.log(res);
      return [];
    }

    // @ts-expect-error ignore implicit any
    return res.data.items.map((item) => {
      return {
        id: new ChannelId(item.id),
        snippet: {
          title: item.snippet.title,
          description: item.snippet.description,
          customUrl: item.snippet.customUrl,
          publishedAt: new Date(item.snippet.publishedAt),
          thumbnails: item.snippet.thumbnails,
        },
      } satisfies Channel;
    }) as Channel[];
  },
};
