import { GoalsSettings, UserSettings } from "../../../main/userSettings";
import { Dispatch, SetStateAction } from "react";

export function GoalsSettingsForm({
  goalsSettings,
  setCurrentUserSettings,
}: {
  goalsSettings: GoalsSettings;
  setCurrentUserSettings: Dispatch<SetStateAction<UserSettings>>;
}) {
  return (
    <div>
      <div>ゴール</div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={goalsSettings.useSubscribersCountGoal}
            onChange={(e) => {
              setCurrentUserSettings((prev) => {
                return { ...prev, ...{ useSubscribersCountGoal: e.target.checked } };
              });
            }}
          />
          チャンネル登録者数の目標を設定する
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={goalsSettings.useLikeCountGoal}
            onChange={(e) => {
              setCurrentUserSettings((prev) => {
                return { ...prev, ...{ useLikeCountGoal: e.target.checked } };
              });
            }}
          />
          高評価数の目標を設定する
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={goalsSettings.useLiveViewCountGoal}
            onChange={(e) => {
              setCurrentUserSettings((prev) => {
                return { ...prev, ...{ useLiveViewCountGoal: e.target.checked } };
              });
            }}
          />
          同時接続数の目標を設定する
        </label>
      </div>
    </div>
  );
}
