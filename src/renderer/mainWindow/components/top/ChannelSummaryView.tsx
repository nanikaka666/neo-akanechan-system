import { Channel } from "../../../../types/youtubeChannel";

export function ChannelSummaryView({ channel }: { channel: Channel }) {
  return (
    <div>
      {channel.bannerUrl && (
        <img src={channel.bannerUrl} alt="channel banner" style={{ width: "100%" }} />
      )}
      <img src={channel.ownerIconUrl} alt="owner icon" style={{ width: "64px", height: "64px" }} />
      <div>{channel.title}</div>
      <div>Subsriber: {channel.subscribersCount}</div>
    </div>
  );
}
