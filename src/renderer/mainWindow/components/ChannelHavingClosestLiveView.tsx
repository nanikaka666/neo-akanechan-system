import { useState, MouseEvent } from "react";
import { ChannelHavingClosestLive } from "../../../ipcEvent";
import { ChannelSummaryView } from "./ChannelSummaryView";

export function ChannelHavingClosestLiveView({
  channelHavingClosestLive,
}: {
  channelHavingClosestLive: ChannelHavingClosestLive;
}) {
  const [isConfirming, setIsConfirming] = useState(false);

  async function onClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsConfirming((_) => true);

    const res = await window.ipcApi.requestOpenOverlay(channelHavingClosestLive.closestLive);
    console.log(res);
    setIsConfirming((_) => false);
  }

  return (
    <div>
      <ChannelSummaryView channelSummary={channelHavingClosestLive.channel} />
      <div>
        <p>Next Live</p>
        <img
          src={channelHavingClosestLive.closestLive.thumbnail}
          alt="next live thumbnail"
          style={{ width: "360px" }}
        />
        <div>{channelHavingClosestLive.closestLive.title.title}</div>
        <div>{channelHavingClosestLive.closestLive.isOnAir ? "On Air" : "Prepareing"}</div>
        <button onClick={onClick} disabled={isConfirming}>
          Live Start
        </button>
      </div>
    </div>
  );
}
