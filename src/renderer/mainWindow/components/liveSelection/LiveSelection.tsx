import { YoutubeLive } from "../../../../types/youtubeLive";
import { Channel } from "../../../../types/youtubeChannel";
import { UserSettingsButton } from "./UserSettingsButton";
import { LiveStartWithVideoIdButton } from "./LiveStartWithVideoIdButton";
import { AccountDisconnectButton } from "./AccountDisconnectButton";

interface LiveSelectionProps {
  channel: Channel;
  lives: YoutubeLive[];
}

export function LiveSelection({ channel, lives }: LiveSelectionProps) {
  return (
    <div className="live-selection-container">
      {channel.bannerUrl && (
        <div className="banner">
          <img src={channel.bannerUrl} />
        </div>
      )}
      <div className="live-selection">
        <div className="channel">
          <div className="owner">
            <img className="icon" src={channel.ownerIconUrl} />
            <div className="name-and-count">
              <div className="name">{channel.title}</div>
              <div className="count">チャンネル登録者数 {channel.subscribersCount}</div>
            </div>
          </div>
          <UserSettingsButton />
          <AccountDisconnectButton />
        </div>
        <div className="lives">
          <ul>
            {lives.map((live) => {
              return (
                <li
                  key={live.videoId.id}
                  onClick={async (e) => {
                    e.preventDefault();
                    await window.ipcApi.mainWindow.mainAppPage.requestTransitToLiveStandBy(
                      channel,
                      live,
                    );
                  }}
                >
                  <img src={live.thumbnailUrl} />
                  {live.type === "inReady" ? (
                    <div>
                      <div>{live.title}</div>
                      <div className="scheduled-start-time">
                        [{live.isPublic ? "公開" : "非公開"}] 配信開始予定{" "}
                        {live.scheduledStartTime.toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div>{live.title}</div>
                      <div className="in-live-mark">ライブ中</div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <LiveStartWithVideoIdButton />
        </div>
      </div>
    </div>
  );
}
