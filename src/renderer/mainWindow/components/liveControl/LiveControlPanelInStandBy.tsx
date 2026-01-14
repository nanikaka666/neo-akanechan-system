import { LiveLaunchProperties } from "../../../../types/liveLaunchProperties";
import { StandByAnnouncement } from "./StandByAnnouncement";
import { SideBarInStandBy } from "./SideBarInStandBy";

export function LiveControlPanelInStandBy({
  liveLaunchProperties,
}: {
  liveLaunchProperties: LiveLaunchProperties;
}) {
  return (
    <>
      <SideBarInStandBy liveLaunchProperties={liveLaunchProperties} />
      <StandByAnnouncement liveLaunchProperties={liveLaunchProperties} />
    </>
  );
}
