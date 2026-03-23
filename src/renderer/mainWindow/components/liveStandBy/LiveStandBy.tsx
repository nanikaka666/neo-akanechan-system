import { StartLiveButton } from "./StartLiveButton";
import { QuitLiveButton } from "../liveControlPanel/QuitLiveButton";
import { SettingsDetails } from "./SettingsDetails";
import { UserSettingsButton } from "../liveSelection/UserSettingsButton";
import { useLiveLaunchProperties } from "../../hooks/useLiveLaunchProperties";
import { useLiveSettings } from "../../../hooks/useLiveSettings";
import { OpenOverlayWindowForm } from "./OpenOverlayWindowForm";

export function LiveStandBy() {
  const liveLaunchProperties = useLiveLaunchProperties();
  const liveSettings = useLiveSettings();

  return liveLaunchProperties && liveSettings ? (
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
      <OpenOverlayWindowForm />
      <StartLiveButton />
      <QuitLiveButton liveLaunchProperties={liveLaunchProperties} />
    </div>
  ) : (
    <div>Now Loading</div>
  );
}
