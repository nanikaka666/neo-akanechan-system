import { useState, MouseEvent } from "react";
import { ChannelHavingClosestLive } from "../../../ipcEvent";
import { ChannelSummaryView } from "./ChannelSummaryView";

export function ChannelHavingClosestLiveView({ channel }: { channel: ChannelHavingClosestLive }) {
  const [isConfirming, setIsConfirming] = useState(false);

  async function onClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsConfirming((_) => true);

    const res = await window.ipcApi.requestOpenOverlay(channel.closestLive);
    console.log(res);
    setIsConfirming((_) => false);
  }

  return (
    <div>
      <ChannelSummaryView channelSummary={channel.channel} />
      <div>
        <p>Next Live</p>
        <img
          src={channel.closestLive.thumbnail}
          alt="next live thumbnail"
          style={{ width: "360px" }}
        />
        <div>{channel.closestLive.title.title}</div>
        <div>{channel.closestLive.isOnAir ? "On Air" : "Prepareing"}</div>
        <button onClick={onClick} disabled={isConfirming}>
          Live Start
        </button>
      </div>
    </div>
  );
}
