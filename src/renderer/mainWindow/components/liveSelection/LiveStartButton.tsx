import { YoutubeLive } from "../../../../types/youtubeLive";
import { Channel } from "../../../../types/youtubeChannel";
import { useButton } from "../hooks/useButton";

export function LiveStartButton({ channel, live }: { channel: Channel; live: YoutubeLive }) {
  const [disabled, disable, enable] = useButton();

  return (
    <button
      onClick={async (e) => {
        e.preventDefault();
        disable();

        await window.ipcApi.requestOpenOverlay(channel, live);
        enable();
      }}
      disabled={disabled}
    >
      Live Start
    </button>
  );
}
