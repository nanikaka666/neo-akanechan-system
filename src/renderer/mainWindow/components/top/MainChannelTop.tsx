import { useState } from "react";
import { ChannelSummaryView } from "./ChannelSummaryView";
import { Channel, YoutubeLive } from "../../../../ipcEvent";
import { UserSettingsButton } from "./UserSettingsButton";

export function MainChannelTop({ channel, lives }: { channel: Channel; lives: YoutubeLive[] }) {
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <div>
      <ChannelSummaryView channel={channel} />
      <UserSettingsButton />
      {lives.map((live) => {
        return (
          <div key={live.videoId.id}>
            <img src={live.thumbnailUrl} alt="next live thumbnail" style={{ width: "360px" }} />
            <p>{live.title}</p>
            <p>{live.isPublic ? "public" : "private"}</p>
            <p>
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  setIsConfirming((_) => true);

                  await window.ipcApi.requestOpenOverlay(channel, live);
                  setIsConfirming((_) => false);
                }}
                disabled={isConfirming}
              >
                Live Start
              </button>
            </p>
          </div>
        );
      })}
    </div>
  );
}
