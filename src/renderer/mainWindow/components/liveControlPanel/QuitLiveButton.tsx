import { LiveLaunchProperties } from "../../../../types/liveLaunchProperties";
import { useButton } from "../../hooks/useButton";

interface QuitLiveButtonProps {
  liveLaunchProperties: LiveLaunchProperties;
}

export function QuitLiveButton({ liveLaunchProperties }: QuitLiveButtonProps) {
  const [disabled, disable, enable] = useButton();
  return (
    <button
      style={{ backgroundColor: "red" }}
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        disable();
        window.ipcApi.mainWindow.requestQuitLive(liveLaunchProperties).then((res) => {
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
