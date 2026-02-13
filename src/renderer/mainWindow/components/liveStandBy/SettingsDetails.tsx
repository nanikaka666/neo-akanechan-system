import { LiveSettings } from "../../../../types/liveSettings";

export function SettingsDetails({
  liveSettings,
  currentSubscriberCount,
}: {
  liveSettings: LiveSettings;
  currentSubscriberCount: number;
}) {
  return (
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
          <div>現在値: {currentSubscriberCount}</div>
          <div>目標値: {liveSettings.subscriberCountGoal}</div>
        </div>
      </div>
    </div>
  );
}
