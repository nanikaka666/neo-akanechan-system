import { useState, MouseEvent } from "react";
import { ChannelTop } from "../../..//ipcEvent";

export function MainChannelView({ channelTop }: { channelTop: ChannelTop }) {
  const [isConfirming, setIsConfirming] = useState(false);

  async function onClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsConfirming((_) => true);

    const res = await window.ipcApi.requestOpenOverlay(channelTop);
    console.log(res);
    setIsConfirming((_) => false);
  }

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
      </div>
      <div>
        <img
          src={channelTop.channel.ownerIcon}
          alt="owner icon"
          style={{ width: "64px", height: "64px" }}
        />
        <div>{channelTop.channel.channelTitle.title}</div>
        <div>Subsriber: {channelTop.channel.subscribersCount}</div>
      </div>
      {channelTop.closestLive ? (
        <div>
          <p>Next Live</p>
          <img
            src={channelTop.closestLive.thumbnail}
            alt="next live thumbnail"
            style={{ width: "360px" }}
          />
          <div>{channelTop.closestLive.title.title}</div>
          <div>{channelTop.closestLive.isOnAir ? "On Air" : "Prepareing"}</div>
          <button onClick={onClick} disabled={isConfirming}>
            Live Start
          </button>
        </div>
      ) : (
        <div>予定されているライブはありません</div>
      )}
    </div>
  );
}
