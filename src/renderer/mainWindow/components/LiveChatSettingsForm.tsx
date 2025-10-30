import { Dispatch, SetStateAction } from "react";
import { LiveChatDisplayStyle, LiveChatSettings, UserSettings } from "../../../main/userSettings";

const displayStyles: LiveChatDisplayStyle[] = ["typical"];

export function LiveChatSettingsForm({
  liveChatSettings,
  setCurrentUserSettings,
}: {
  liveChatSettings: LiveChatSettings;
  setCurrentUserSettings: Dispatch<SetStateAction<UserSettings>>;
}) {
  return (
    <div>
      <div>ライブチャット</div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={liveChatSettings.useLiveChatDisplay}
            onChange={(e) => {
              setCurrentUserSettings((prev) => {
                return { ...prev, ...{ useLiveChatDisplay: e.target.checked } };
              });
            }}
          ></input>
          ライブチャットの内容をオーバーレイに映す
        </label>
      </div>

      <div>
        表示方法
        {displayStyles.map((style) => (
          <label key={style}>
            <input
              type="radio"
              name="displayStyle"
              disabled={!liveChatSettings.useLiveChatDisplay}
              checked={style === liveChatSettings.displayStyle}
              onChange={() => {
                setCurrentUserSettings((prev) => {
                  return { ...prev, ...{ displayStyle: style } };
                });
              }}
            />
            {style}
          </label>
        ))}
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={liveChatSettings.authorIconVisibility}
            disabled={!liveChatSettings.useLiveChatDisplay}
            onChange={(e) => {
              setCurrentUserSettings((prev) => {
                return { ...prev, ...{ authorIconVisibility: e.target.checked } };
              });
            }}
          />
          ユーザアイコンを表示する
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={liveChatSettings.authorNameVisibility}
            disabled={!liveChatSettings.useLiveChatDisplay}
            onChange={(e) => {
              setCurrentUserSettings((prev) => {
                return { ...prev, ...{ authorNameVisibility: e.target.checked } };
              });
            }}
          />
          ユーザ名を表示する
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={liveChatSettings.membershipBadgeVisibility}
            disabled={!liveChatSettings.useLiveChatDisplay}
            onChange={(e) => {
              setCurrentUserSettings((prev) => {
                return { ...prev, ...{ membershipBadgeVisibility: e.target.checked } };
              });
            }}
          />
          メンバーシップバッジを表示する
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={liveChatSettings.decorateFirstChat}
            disabled={!liveChatSettings.useLiveChatDisplay}
            onChange={(e) => {
              setCurrentUserSettings((prev) => {
                return { ...prev, ...{ decorateFirstChat: e.target.checked } };
              });
            }}
          />
          最初の書き込みを目立たせる
        </label>
      </div>
    </div>
  );
}
