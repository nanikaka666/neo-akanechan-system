import { ChannelSummary } from "../../../../ipcEvent";

export function ChannelSummaryView({ channelSummary }: { channelSummary: ChannelSummary }) {
  return (
    <div>
      {channelSummary.channelBanner && (
        <img src={channelSummary.channelBanner} alt="channel banner" style={{ width: "100%" }} />
      )}
      <img
        src={channelSummary.ownerIcon}
        alt="owner icon"
        style={{ width: "64px", height: "64px" }}
      />
      <div>{channelSummary.channelTitle}</div>
      <div>Subsriber: {channelSummary.subscribersCount}</div>
    </div>
  );
}
