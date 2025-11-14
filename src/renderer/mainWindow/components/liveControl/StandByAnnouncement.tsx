import { LiveLaunchProperties } from "../../../../ipcEvent";

export function StandByAnnouncement({
  liveLaunchProperties,
  prepareCompletion,
}: {
  liveLaunchProperties: LiveLaunchProperties;
  prepareCompletion: () => void;
}) {
  return (
    <div style={{ position: "absolute", top: 0, left: "100px" }}>
      <div>配信スタンバイ中</div>
      <div>
        「{liveLaunchProperties.overlayWindowTitle}」のウィンドウをOBS上でキャプチャしてください
      </div>
      <div>準備ができたら「OK」を押してください</div>
      <button onClick={prepareCompletion}>OK</button>
    </div>
  );
}
