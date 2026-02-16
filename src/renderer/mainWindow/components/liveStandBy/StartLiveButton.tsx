import { useState } from "react";
import { LiveLaunchProperties } from "../../../../types/liveLaunchProperties";

export function StartLiveButton({
  liveLaunchProperties,
}: {
  liveLaunchProperties: LiveLaunchProperties;
}) {
  const [disabled, setDisabled] = useState(false);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        setDisabled((_) => true);
        window.ipcApi.requestStartLive(liveLaunchProperties);
      }}
      disabled={disabled}
    >
      ライブを開始する
    </button>
  );
}
