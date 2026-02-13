import { GoalsSettings, UserSettings } from "../../../../types/userSettings";
import { Dispatch, SetStateAction } from "react";
import { GoalsValueInput } from "./GoalsValueInput";

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
          チャンネル登録者数の目標値
          <GoalsValueInput
            initialValue={goalsSettings.subscribersCountGoalValue}
            func={(value) => {
              setCurrentUserSettings((prev) => {
                return { ...prev, ...{ subscribersCountGoalValue: value } };
              });
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
          高評価数の最終目標値
          <GoalsValueInput
            initialValue={goalsSettings.likeCountGoalMaxValue}
            func={(value) => {
              setCurrentUserSettings((prev) => {
                return { ...prev, ...{ likeCountGoalMaxValue: value } };
              });
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
              setCurrentUserSettings((prev) => {
                return { ...prev, ...{ useLiveViewCountGoal: e.target.checked } };
              });
            }}
          />
          同時接続数の目標を設定する
        </label>
      </div>
      <div>
        <label>
          同接数の最終目標値
          <GoalsValueInput
            initialValue={goalsSettings.liveViewCountGoalMaxValue}
            func={(value) => {
              setCurrentUserSettings((prev) => {
                return { ...prev, ...{ liveViewCountGoalMaxValue: value } };
              });
            }}
          />
        </label>
      </div>
    </div>
  );
}
