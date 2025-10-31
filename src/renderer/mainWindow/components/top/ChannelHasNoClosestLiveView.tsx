import { ChannelHasNoClosestLive } from "../../../../ipcEvent";
import { ChannelSummaryView } from "./ChannelSummaryView";
import { UserSettingsFormLoader } from "../userSettings/UserSettingsFormLoader";

export function ChannelHasNoClosestLiveView({
  channelHasNoClosestLive,
}: {
  channelHasNoClosestLive: ChannelHasNoClosestLive;
}) {
  return (
    <>
      <div style={{ position: "absolute", left: "100px" }}>
        <ChannelSummaryView channelSummary={channelHasNoClosestLive.channel} />
        <div>予定されているライブはありません</div>
        <UserSettingsFormLoader channelSummary={channelHasNoClosestLive.channel} />
      </div>
    </>
  );
}
