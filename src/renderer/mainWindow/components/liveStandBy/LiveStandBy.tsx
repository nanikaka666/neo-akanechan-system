import { LiveLaunchProperties } from "../../../../types/liveLaunchProperties";
import { StandByAnnouncement } from "./StandByAnnouncement";
import { SideBarInStandBy } from "./SideBarInStandBy";
import { LiveSettings } from "../../../../types/liveSettings";

export function LiveStandBy({
  liveLaunchProperties,
  liveSettings,
}: {
  liveLaunchProperties: LiveLaunchProperties;
  liveSettings: LiveSettings;
}) {
  return (
    <>
      <SideBarInStandBy liveLaunchProperties={liveLaunchProperties} />
      <StandByAnnouncement liveLaunchProperties={liveLaunchProperties} />
    </>
  );
}
