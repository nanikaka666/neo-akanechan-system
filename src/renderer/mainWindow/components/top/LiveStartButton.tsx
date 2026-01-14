import { Channel, YoutubeLive } from "../../../../types/ipcEvent";
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
