import { useState } from "react";
import { LiveLaunchProperties } from "../../../../types/ipcEvent";

export function StandByAnnouncement({
  liveLaunchProperties,
}: {
  liveLaunchProperties: LiveLaunchProperties;
}) {
  const [disabled, setDisabled] = useState(false);

  return (
    <div style={{ position: "absolute", top: 0, left: "100px" }}>
      <div>配信スタンバイ中</div>
      <div>
        「{liveLaunchProperties.overlayWindowTitle}」のウィンドウをOBS上でキャプチャしてください
      </div>
      <div>準備ができたら「OK」を押してください</div>
      <button
        onClick={(e) => {
          e.preventDefault();
          setDisabled((_) => true);
          window.ipcApi.requestStartLive(liveLaunchProperties);
        }}
        disabled={disabled}
      >
        OK
      </button>
    </div>
  );
}
