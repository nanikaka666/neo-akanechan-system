import { ChannelHavingClosestLive } from "../../../ipcEvent";

export function LiveControlPanel({
  channelHavingClosestLive,
}: {
  channelHavingClosestLive: ChannelHavingClosestLive;
}) {
  return (
    <div>
      <div>Overlay Control Panels.</div>
      <div>Comment Viewer</div>
      <div>Chance Time</div>
      <div>Point Rankings</div>
    </div>
  );
}
