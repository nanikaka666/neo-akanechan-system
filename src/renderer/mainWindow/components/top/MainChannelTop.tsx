import { ChannelSummaryView } from "./ChannelSummaryView";
import { YoutubeLive } from "../../../../types/ipcEvent";
import { Channel } from "../../../../types/youtubeChannel";
import { UserSettingsButton } from "./UserSettingsButton";
import { LiveStartButton } from "./LiveStartButton";
import { LiveStartWithVideoIdButton } from "./LiveStartWithVideoIdButton";

export function MainChannelTop({ channel, lives }: { channel: Channel; lives: YoutubeLive[] }) {
  return (
    <div>
      <ChannelSummaryView channel={channel} />
      <UserSettingsButton />
      {lives.map((live) => {
        return (
          <div key={live.videoId.id}>
            <img src={live.thumbnailUrl} alt="next live thumbnail" style={{ width: "360px" }} />
            <p>{live.title}</p>
            <p>{live.isPublic ? "public" : "private"}</p>
            <p>
              <LiveStartButton channel={channel} live={live} />
            </p>
          </div>
        );
      })}
      <LiveStartWithVideoIdButton />
    </div>
  );
}
