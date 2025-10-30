import { useEffect, useState } from "react";
import { ChannelTop } from "../../../ipcEvent";
import { ChannelId } from "youtube-live-scraper";
import { ChannelHasNoClosestLiveView } from "./ChannelHasNoClosestLiveView";
import { ChannelHavingClosestLiveView } from "./ChannelHavingClosestLiveView";

export function MainChannelTopLoader({ mainChannelId }: { mainChannelId: ChannelId }) {
  const [channelTop, setChannelTop] = useState<ChannelTop>();

  useEffect(() => {
    window.ipcApi.requestChannelTop(mainChannelId).then(setChannelTop).catch(console.log);
  }, []);

  return channelTop ? (
    channelTop.type === "has_no_closest_live" ? (
      <ChannelHasNoClosestLiveView channelHasNoClosestLive={channelTop} />
    ) : (
      <ChannelHavingClosestLiveView channelHavingClosestLive={channelTop} />
    )
  ) : (
    <div>Now Loading...</div>
  );
}
