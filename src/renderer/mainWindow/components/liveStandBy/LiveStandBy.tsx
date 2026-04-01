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
    <div className="live-standby">
      <div className="header">
        <img src={liveLaunchProperties.live.thumbnailUrl} />
        <h1>{liveLaunchProperties.live.title}</h1>
      </div>
      <UserSettingsButton />
      <SettingsDetails
        liveSettings={liveSettings}
        currentSubscriberCount={liveLaunchProperties.channel.subscribersCount}
      />
      <OpenOverlayWindowForm />
      <div>
        <StartLiveButton />
      </div>
      <div className="quit-button-container">
        <QuitLiveButton liveLaunchProperties={liveLaunchProperties} />
      </div>
    </div>
  ) : (
    <div>Now Loading</div>
  );
}
