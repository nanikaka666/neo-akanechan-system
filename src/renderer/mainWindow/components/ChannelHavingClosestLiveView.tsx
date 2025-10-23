import { ChannelHavingClosestLive } from "../../../ipcEvent";
import { ChannelSummaryView } from "./ChannelSummaryView";
import { ClosestLiveView } from "./ClosestLiveView";

export function ChannelHavingClosestLiveView({ channel }: { channel: ChannelHavingClosestLive }) {
  return (
    <div>
      <ChannelSummaryView channelSummary={channel.channel} />
      <ClosestLiveView closestLive={channel.closestLive} />
    </div>
  );
}
