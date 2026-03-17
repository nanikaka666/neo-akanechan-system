import { LiveLaunchProperties } from "../../../../types/liveLaunchProperties";
import { useButton } from "../hooks/useButton";

export function QuitLiveButton({
  liveLaunchProperties,
}: {
  liveLaunchProperties: LiveLaunchProperties;
}) {
  const [disabled, disable, enable] = useButton();
  return (
    <button
      style={{ backgroundColor: "red" }}
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        disable();
        window.ipcApi.requestQuitLive(liveLaunchProperties).then((res) => {
          if (!res) {
            enable();
          }
        });
      }}
    >
      ライブ配信をやめる
    </button>
  );
}
