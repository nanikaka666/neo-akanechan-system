import axios from "axios";
import { getAccessToken } from "../auth/google";

export const YoutubeApiClient = {
  getChannelIdOfMine: async () => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return undefined;
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

    console.log(res.data.items[0].id);
    return res.data.items[0].id as string;
  },
};
