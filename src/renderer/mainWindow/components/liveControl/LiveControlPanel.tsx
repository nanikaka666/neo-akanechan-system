import { useState } from "react";
import { ChannelHavingClosestLive } from "../../../../ipcEvent";
import { StandByAnnouncement } from "./StandByAnnouncement";

export function LiveControlPanel({
  channelHavingClosestLive,
}: {
  channelHavingClosestLive: ChannelHavingClosestLive;
}) {
  const [isStandBy, setIsStandBy] = useState(true);

  function prepareCompletion() {
    setIsStandBy((_) => false);
  }

  return (
    <>
      <div>
        <div>Overlay Control Panels.</div>
        <div>Comment Viewer</div>
        <div>Chance Time</div>
        <div>Point Rankings</div>
      </div>
      {isStandBy && <StandByAnnouncement prepareCompletion={prepareCompletion} />}
    </>
  );
}
