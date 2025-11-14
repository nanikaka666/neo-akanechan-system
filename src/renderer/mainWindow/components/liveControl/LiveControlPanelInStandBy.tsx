import { useState } from "react";
import { ChannelHavingClosestLive } from "../../../../ipcEvent";
import { StandByAnnouncement } from "./StandByAnnouncement";
import { UserSettings } from "../../../../main/userSettings";
import { LiveControlPanel } from "./LiveControlPanel";
import { SideBarInStandBy } from "./SideBarInStandBy";

export function LiveControlPanelInStandBy({
  channelHavingClosestLive,
  userSettings,
}: {
  channelHavingClosestLive: ChannelHavingClosestLive;
  userSettings: UserSettings;
}) {
  const [isStandBy, setIsStandBy] = useState(true);

  function prepareCompletion() {
    setIsStandBy((_) => false);
  }

  return (
    <>
      {isStandBy ? (
        <>
          <SideBarInStandBy
            channelHavingClosestLive={channelHavingClosestLive}
            userSettings={userSettings}
          />
          <StandByAnnouncement prepareCompletion={prepareCompletion} />
        </>
      ) : (
        <LiveControlPanel
          channelHavingClosestLive={channelHavingClosestLive}
          userSettings={userSettings}
        />
      )}
    </>
  );
}
