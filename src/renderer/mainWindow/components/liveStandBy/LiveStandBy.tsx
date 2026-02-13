import { LiveLaunchProperties } from "../../../../types/liveLaunchProperties";
import { LiveSettings } from "../../../../types/liveSettings";
import { StartLiveButton } from "./StartLiveButton";
import { QuitLiveButton } from "../liveControlPanel/QuitLiveButton";
import { SettingsDetails } from "./SettingsDetails";

export function LiveStandBy({
  liveLaunchProperties,
  liveSettings,
}: {
  liveLaunchProperties: LiveLaunchProperties;
  liveSettings: LiveSettings;
}) {
  return (
    <div>
      <div>
        <img src={liveLaunchProperties.live.thumbnailUrl} />
        {liveLaunchProperties.live.title}
      </div>
      <div>
        <div>配信スタンバイ中</div>
        <div>
          「{liveLaunchProperties.overlayWindowTitle}」のウィンドウをOBS上でキャプチャしてください
        </div>
      </div>
      <SettingsDetails
        liveSettings={liveSettings}
        currentSubscriberCount={liveLaunchProperties.channel.subscribersCount}
      />
      <StartLiveButton liveLaunchProperties={liveLaunchProperties} />
      <QuitLiveButton liveLaunchProperties={liveLaunchProperties} />
    </div>
  );
}
