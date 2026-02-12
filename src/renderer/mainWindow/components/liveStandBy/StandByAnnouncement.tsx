import { LiveLaunchProperties } from "../../../../types/liveLaunchProperties";
import { StartLiveButton } from "./StartLiveButton";

export function StandByAnnouncement({
  liveLaunchProperties,
}: {
  liveLaunchProperties: LiveLaunchProperties;
}) {
  return (
    <div style={{ position: "absolute", top: 0, left: "100px" }}>
      <div>配信スタンバイ中</div>
      <div>
        「{liveLaunchProperties.overlayWindowTitle}」のウィンドウをOBS上でキャプチャしてください
      </div>
      <div>準備ができたら「OK」を押してください</div>
      <StartLiveButton liveLaunchProperties={liveLaunchProperties} />
    </div>
  );
}
