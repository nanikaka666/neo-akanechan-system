import { useState } from "react";
import { LiveLaunchProperties } from "../../../../ipcEvent";
import { StandByAnnouncement } from "./StandByAnnouncement";
import { LiveControlPanel } from "./LiveControlPanel";
import { SideBarInStandBy } from "./SideBarInStandBy";

export function LiveControlPanelInStandBy({
  liveLaunchProperties,
}: {
  liveLaunchProperties: LiveLaunchProperties;
}) {
  const [isStandBy, setIsStandBy] = useState(true);

  function prepareCompletion() {
    setIsStandBy((_) => false);
  }

  return (
    <>
      {isStandBy ? (
        <>
          <SideBarInStandBy liveLaunchProperties={liveLaunchProperties} />
          <StandByAnnouncement prepareCompletion={prepareCompletion} />
        </>
      ) : (
        <LiveControlPanel liveLaunchProperties={liveLaunchProperties} />
      )}
    </>
  );
}
