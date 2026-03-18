import { LiveSettings } from "../../../../types/liveSettings";
import { GoalsHavingLevels } from "./GoalsHavingLevels";

interface SettingsDetailsProps {
  liveSettings: LiveSettings;
  currentSubscriberCount: number;
}

export function SettingsDetails({ liveSettings, currentSubscriberCount }: SettingsDetailsProps) {
  return (
    <div>
      <div>配信設定の確認</div>
      <div>
        <div>高評価数の目標値</div>
        <GoalsHavingLevels goal={liveSettings.likeCountGoal} />
      </div>

      <div>
        <div>同接数の目標値</div>
        <GoalsHavingLevels goal={liveSettings.viewerCountGoal} />
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
