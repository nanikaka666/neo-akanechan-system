import { YoutubeLive } from "../../../../types/youtubeLive";
import { Channel } from "../../../../types/youtubeChannel";
import { useState } from "react";

export function LiveStartButton({ channel, live }: { channel: Channel; live: YoutubeLive }) {
  const [isConfirming, setIsConfirming] = useState(false);

  return (
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
  );
}
