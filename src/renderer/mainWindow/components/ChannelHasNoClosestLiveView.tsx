import { ChannelHasNoClosestLive } from "../../../ipcEvent";
import { ChannelSummaryView } from "./ChannelSummaryView";

export function ChannelHasNoClosestLiveView({ channel }: { channel: ChannelHasNoClosestLive }) {
  return (
    <div>
      <ChannelSummaryView channelSummary={channel.channel} />
      <div>予定されているライブはありません</div>
    </div>
  );
}
