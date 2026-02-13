import { LiveLaunchProperties } from "../../../../types/liveLaunchProperties";
import { LiveSettings } from "../../../../types/liveSettings";
import { StartLiveButton } from "./StartLiveButton";
import { QuitLiveButton } from "../liveControlPanel/QuitLiveButton";
import { SettingsDetails } from "./SettingsDetails";
import { UserSettingsButton } from "../liveSelection/UserSettingsButton";

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
      <UserSettingsButton />
      <SettingsDetails
        liveSettings={liveSettings}
        currentSubscriberCount={liveLaunchProperties.channel.subscribersCount}
      />
      <StartLiveButton liveLaunchProperties={liveLaunchProperties} />
      <QuitLiveButton liveLaunchProperties={liveLaunchProperties} />
    </div>
  );
}
