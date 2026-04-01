import { LiveLaunchProperties } from "../../../../types/liveLaunchProperties";
import { useButton } from "../../hooks/useButton";

interface QuitLiveButtonProps {
  liveLaunchProperties: LiveLaunchProperties;
}

export function QuitLiveButton({ liveLaunchProperties }: QuitLiveButtonProps) {
  const [disabled, disable, enable] = useButton();
  return (
    <button
      className="danger-action-button"
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        disable();
        window.ipcApi.mainWindow.mainAppPage.requestQuitLive(liveLaunchProperties).then((res) => {
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
