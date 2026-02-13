import { LiveLaunchProperties } from "../../../../types/liveLaunchProperties";
import { LiveSettings } from "../../../../types/liveSettings";
import { StartLiveButton } from "./StartLiveButton";
import { QuitLiveButton } from "../liveControlPanel/QuitLiveButton";

export function LiveStandBy({
  liveLaunchProperties,
  liveSettings,
}: {
  liveLaunchProperties: LiveLaunchProperties;
  liveSettings: LiveSettings;
}) {
  return (
    <div>
      <div>
        <img src={liveLaunchProperties.live.thumbnailUrl} />
        {liveLaunchProperties.live.title}
      </div>
      <div>
        <div>配信スタンバイ中</div>
        <div>
          「{liveLaunchProperties.overlayWindowTitle}」のウィンドウをOBS上でキャプチャしてください
        </div>
      </div>
      <div>
        <div>配信設定の確認</div>
        <div>
          <div>高評価数の目標値</div>
          <div>
            <div>最終目標値: {liveSettings.likeCountGoal.goalValues.slice(-1)}</div>
            <div>小目標</div>
            <ul>
              {liveSettings.likeCountGoal.goalValues.map((goalValue, idx) => {
                return idx === 0 ? null : (
                  <li key={idx}>
                    Level {idx}: {goalValue}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div>
          <div>同接数の目標値</div>
          <div>
            <div>最終目標値: {liveSettings.viewerCountGoal.goalValues.slice(-1)}</div>
            <div>小目標</div>
            <ul>
              {liveSettings.viewerCountGoal.goalValues.map((goalValue, idx) => {
                return idx === 0 ? null : (
                  <li key={idx}>
                    Level {idx}: {goalValue}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div>
          <div>チャンネル登録者数の目標値</div>
          <div>
            <div>現在値: {liveLaunchProperties.channel.subscribersCount}</div>
            <div>目標値: {liveSettings.subscriberCountGoal}</div>
          </div>
        </div>
      </div>
      <StartLiveButton liveLaunchProperties={liveLaunchProperties} />
      <QuitLiveButton liveLaunchProperties={liveLaunchProperties} />
    </div>
  );
}
