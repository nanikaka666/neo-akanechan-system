import { useEffect, useState } from "react";
import { ChannelTop } from "../../../../ipcEvent";
import { ChannelHasNoClosestLiveView } from "./ChannelHasNoClosestLiveView";
import { ChannelHavingClosestLiveView } from "./ChannelHavingClosestLiveView";
import { ChannelId } from "../../../../main/youtubeApi/model";

export function MainChannelTop({ mainChannelId }: { mainChannelId: ChannelId }) {
  const [channelTop, setChannelTop] = useState<ChannelTop>();

  useEffect(() => {
    window.ipcApi.requestChannelTop(mainChannelId).then(setChannelTop).catch(console.log);
  }, [mainChannelId]);

  return channelTop ? (
    channelTop.type === "has_no_closest_live" ? (
      <ChannelHasNoClosestLiveView channelHasNoClosestLive={channelTop} />
    ) : (
      <ChannelHavingClosestLiveView channelHavingClosestLive={channelTop} />
    )
  ) : (
    <div style={{ position: "absolute", left: "100px" }}>Now Loading...</div>
  );
}
