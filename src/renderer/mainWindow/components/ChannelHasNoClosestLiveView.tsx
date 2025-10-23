import { ChannelHasNoClosestLive } from "../../../ipcEvent";
import { ChannelSummaryView } from "./ChannelSummaryView";

export function ChannelHasNoClosestLiveView({
  channelHasNoClosestLive,
}: {
  channelHasNoClosestLive: ChannelHasNoClosestLive;
}) {
  return (
    <div>
      <ChannelSummaryView channelSummary={channelHasNoClosestLive.channel} />
      <div>予定されているライブはありません</div>
    </div>
  );
}
