import { ChannelTop } from "../../..//ipcEvent";
import { ClosestLiveView } from "./ClosestLiveView";

export function MainChannelView({ channelTop }: { channelTop: ChannelTop }) {
  return (
    <div>
      <div>
        {channelTop.channel.channelBanner && (
          <img
            src={channelTop.channel.channelBanner}
            alt="channel banner"
            style={{ width: "100%" }}
          />
        )}
        <img
          src={channelTop.channel.ownerIcon}
          alt="owner icon"
          style={{ width: "64px", height: "64px" }}
        />
        <div>{channelTop.channel.channelTitle.title}</div>
        <div>Subsriber: {channelTop.channel.subscribersCount}</div>
      </div>
      {channelTop.type === "has_closest_live" ? (
        <ClosestLiveView closestLive={channelTop.closestLive} />
      ) : (
        <div>予定されているライブはありません</div>
      )}
    </div>
  );
}
