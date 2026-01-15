import { LiveLaunchProperties } from "../../../../types/liveLaunchProperties";
import { StandByAnnouncement } from "./StandByAnnouncement";
import { SideBarInStandBy } from "./SideBarInStandBy";

export function LiveStandBy({
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
