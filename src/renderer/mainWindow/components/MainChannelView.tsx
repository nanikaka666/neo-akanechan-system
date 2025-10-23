import { ChannelTop } from "../../..//ipcEvent";
import { ChannelSummaryView } from "./ChannelSummaryView";
import { ClosestLiveView } from "./ClosestLiveView";

export function MainChannelView({ channelTop }: { channelTop: ChannelTop }) {
  return (
    <div>
      <ChannelSummaryView channelSummary={channelTop.channel} />
      {channelTop.type === "has_closest_live" ? (
        <ClosestLiveView closestLive={channelTop.closestLive} />
      ) : (
        <div>予定されているライブはありません</div>
      )}
    </div>
  );
}
