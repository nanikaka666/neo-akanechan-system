import { CSSProperties, useEffect, useState } from "react";
import { ChannelSummary } from "../../../../ipcEvent";
import { ChannelId } from "youtube-live-scraper";

export function ChannelList({ currentMainChannelId }: { currentMainChannelId: ChannelId }) {
  const [channels, setChannels] = useState<ChannelSummary[]>();

  useEffect(() => {
    window.ipcApi.requestRegisteredChannels().then(setChannels);
  }, []);

  return channels ? (
    <div style={{ width: "100px", height: "100%", position: "absolute", top: 0, left: 0 }}>
      ChannelList
      {channels.map((channel) => {
        const styles: CSSProperties | undefined =
          channel.channelId.id === currentMainChannelId.id
            ? {
                backgroundColor: "orange",
              }
            : undefined;
        return (
          <div key={channel.channelId.id} style={styles}>
            <img src={channel.ownerIcon} style={{ width: "32px", height: "32px" }} />
            {channel.channelTitle.title}
          </div>
        );
      })}
    </div>
  ) : (
    <div style={{ width: "100px", height: "100%", position: "absolute", top: 0, left: 0 }}>
      Now Loading...
    </div>
  );
}
