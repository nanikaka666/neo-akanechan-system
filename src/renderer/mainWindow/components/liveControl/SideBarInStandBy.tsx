import { ChannelHavingClosestLive } from "../../../../ipcEvent";
import { UserSettings } from "../../../../main/userSettings";

export function SideBarInStandBy({
  channelHavingClosestLive,
  userSettings,
}: {
  channelHavingClosestLive: ChannelHavingClosestLive;
  userSettings: UserSettings;
}) {
  return (
    <div style={{ width: "100px", height: "100%", position: "absolute", top: 0, left: 0 }}>
      <div>
        <img src={channelHavingClosestLive.closestLive.thumbnail} style={{ width: "100px" }}></img>
      </div>
      <div>Comment Viewer</div>
      <div>Chance Time</div>
      <div>Participant Point Rankings</div>
      <div>Neighborhoods</div>
    </div>
  );
}
