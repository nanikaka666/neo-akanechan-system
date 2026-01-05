import { Channel } from "../../../../main/youtubeApi/model";

export function ChannelSummaryView({ channelSummary }: { channelSummary: Channel }) {
  return (
    <div>
      {channelSummary.brandingSettings.image && (
        <img
          src={channelSummary.brandingSettings.image.bannerExternalUrl}
          alt="channel banner"
          style={{ width: "100%" }}
        />
      )}
      <img
        src={channelSummary.snippet.thumbnails.default.url}
        alt="owner icon"
        style={{ width: "64px", height: "64px" }}
      />
      <div>{channelSummary.snippet.title}</div>
      <div>Subsriber: {channelSummary.statistics.subscriberCount}</div>
    </div>
  );
}
