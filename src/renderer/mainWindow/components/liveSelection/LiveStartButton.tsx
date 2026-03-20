import { YoutubeLive } from "../../../../types/youtubeLive";
import { Channel } from "../../../../types/youtubeChannel";
import { useButton } from "../hooks/useButton";

interface LiveStartButtonProps {
  channel: Channel;
  live: YoutubeLive;
}

export function LiveStartButton({ channel, live }: LiveStartButtonProps) {
  const [disabled, disable, enable] = useButton();

  return (
    <button
      onClick={async (e) => {
        e.preventDefault();
        disable();

        await window.ipcApi.lcp.requestOpenOverlay(channel, live);
        enable();
      }}
      disabled={disabled}
    >
      Live Start
    </button>
  );
}
