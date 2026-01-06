import { useState, MouseEvent } from "react";
import { ChannelSummaryView } from "./ChannelSummaryView";
import { Channel, YoutubeLive } from "../../../../ipcEvent";
import { UserSettingsButton } from "./UserSettingsButton";

export function MainChannelTop({ channel, live }: { channel: Channel; live: YoutubeLive[] }) {
  const [isConfirming, setIsConfirming] = useState(false);

  async function onClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsConfirming((_) => true);

    // todo: call this function
    // await window.ipcApi.requestOpenOverlay(channelHavingClosestLive);
    setIsConfirming((_) => false);
  }
  return (
    <div>
      <ChannelSummaryView channel={channel} />
      <UserSettingsButton />
      {live.map((live) => {
        return (
          <div key={live.videoId.id}>
            <img src={live.thumbnailUrl} alt="next live thumbnail" style={{ width: "360px" }} />
            <p>{live.title}</p>
            <p>{live.scheduledStartTime.toLocaleString()}</p>
            <p>{live.isPublic ? "public" : "private"}</p>
            <p>
              <button onClick={onClick} disabled={isConfirming}>
                Live Start
              </button>
            </p>
          </div>
        );
      })}
    </div>
  );
}
