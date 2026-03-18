import { GoalsSettings, UserSettings } from "../../../../types/userSettings";
import { GoalsValueInput } from "./GoalsValueInput";
import { GoalsLevelInput } from "./GoalsLevelInput";

interface GoalsSettingsFormProps {
  goalsSettings: GoalsSettings;
  updateUserSettingsOnEditting: (settings: Partial<UserSettings>) => void;
}

export function GoalsSettingsForm({
  goalsSettings,
  updateUserSettingsOnEditting,
}: GoalsSettingsFormProps) {
  return (
    <div>
      <div>ゴール</div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={goalsSettings.useSubscribersCountGoal}
            onChange={(e) => {
              updateUserSettingsOnEditting({ useSubscribersCountGoal: e.target.checked });
            }}
          />
          チャンネル登録者数の目標を設定する
        </label>
      </div>
      <div>
        <label>
          チャンネル登録者数の目標値
          <GoalsValueInput
            initialValue={goalsSettings.subscribersCountGoalValue}
            func={(value) => {
              updateUserSettingsOnEditting({ subscribersCountGoalValue: value });
            }}
          />
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={goalsSettings.useLikeCountGoal}
            onChange={(e) => {
              updateUserSettingsOnEditting({ useLikeCountGoal: e.target.checked });
            }}
          />
          高評価数の目標を設定する
        </label>
      </div>
      <div>
        <label>
          高評価数の目標レベル数
          <GoalsLevelInput
            initialValue={goalsSettings.likeCountGoalMaxLevel}
            func={(level) => {
              updateUserSettingsOnEditting({ likeCountGoalMaxLevel: level });
            }}
          />
        </label>
      </div>
      <div>
        <label>
          高評価数の最終目標値
          <GoalsValueInput
            initialValue={goalsSettings.likeCountGoalMaxValue}
            func={(value) => {
              updateUserSettingsOnEditting({ likeCountGoalMaxValue: value });
            }}
          />
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={goalsSettings.useLiveViewCountGoal}
            onChange={(e) => {
              updateUserSettingsOnEditting({ useLiveViewCountGoal: e.target.checked });
            }}
          />
          同時接続数の目標を設定する
        </label>
      </div>
      <div>
        <label>
          同接数の目標レベル数
          <GoalsLevelInput
            initialValue={goalsSettings.liveViewCountGoalMaxLevel}
            func={(level) => {
              updateUserSettingsOnEditting({ liveViewCountGoalMaxLevel: level });
            }}
          />
        </label>
      </div>
      <div>
        <label>
          同接数の最終目標値
          <GoalsValueInput
            initialValue={goalsSettings.liveViewCountGoalMaxValue}
            func={(value) => {
              updateUserSettingsOnEditting({ liveViewCountGoalMaxValue: value });
            }}
          />
        </label>
      </div>
    </div>
  );
}
