import { LiveLaunchProperties } from "../../../../types/liveLaunchProperties";
import { QuitLiveButton } from "../liveControlPanel/QuitLiveButton";

export function SideBarInStandBy({
  liveLaunchProperties,
}: {
  liveLaunchProperties: LiveLaunchProperties;
}) {
  return (
    <div style={{ width: "100px", height: "100%", position: "absolute", top: 0, left: 0 }}>
      <div>
        <img src={liveLaunchProperties.live.thumbnailUrl} style={{ width: "100px" }}></img>
      </div>
      <div>Comment Viewer</div>
      <div>Chance Time</div>
      <div>Participant Point Rankings</div>
      <div>Neighborhoods</div>
      <QuitLiveButton liveLaunchProperties={liveLaunchProperties} />
    </div>
  );
}
