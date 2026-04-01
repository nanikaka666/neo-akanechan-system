import { LiveSettings } from "../../../../types/liveSettings";
import { GoalsHavingLevels } from "./GoalsHavingLevels";

interface SettingsDetailsProps {
  liveSettings: LiveSettings;
  currentSubscriberCount: number;
}

export function SettingsDetails({ liveSettings, currentSubscriberCount }: SettingsDetailsProps) {
  return (
    <div className="setting-details">
      <h2>配信設定の確認</h2>
      <div>
        <h3>高評価数の目標値</h3>
        <GoalsHavingLevels goal={liveSettings.likeCountGoal} />
      </div>

      <div>
        <h3>同接数の目標値</h3>
        <GoalsHavingLevels goal={liveSettings.viewerCountGoal} />
      </div>

      <div>
        <h3>チャンネル登録者数の目標値</h3>
        <div>
          <div>現在値: {currentSubscriberCount}</div>
          <div>目標値: {liveSettings.subscriberCountGoal}</div>
        </div>
      </div>
    </div>
  );
}
