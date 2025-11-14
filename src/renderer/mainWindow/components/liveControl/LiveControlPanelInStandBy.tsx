import { useState } from "react";
import { ChannelHavingClosestLive } from "../../../../ipcEvent";
import { StandByAnnouncement } from "./StandByAnnouncement";
import { UserSettings } from "../../../../main/userSettings";
import { LiveControlPanel } from "./LiveControlPanel";

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
        <StandByAnnouncement prepareCompletion={prepareCompletion} />
      ) : (
        <LiveControlPanel
          channelHavingClosestLive={channelHavingClosestLive}
          userSettings={userSettings}
        />
      )}
    </>
  );
}
