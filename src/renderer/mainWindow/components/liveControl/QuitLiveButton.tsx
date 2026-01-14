import { useState } from "react";
import { LiveLaunchProperties } from "../../../../types/liveLaunchProperties";

export function QuitLiveButton({
  liveLaunchProperties,
}: {
  liveLaunchProperties: LiveLaunchProperties;
}) {
  const [disabled, setDisabled] = useState(false);
  return (
    <button
      style={{ backgroundColor: "red" }}
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        setDisabled((_) => true);
        window.ipcApi.requestQuitLive(liveLaunchProperties).then((res) => {
          if (!res) {
            setDisabled((_) => false);
          }
        });
      }}
    >
      ライブ配信をやめる
    </button>
  );
}
