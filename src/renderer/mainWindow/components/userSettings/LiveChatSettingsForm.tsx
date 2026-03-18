import {
  LiveChatDisplayStyle,
  LiveChatSettings,
  UserSettings,
} from "../../../../types/userSettings";

const displayStyles: LiveChatDisplayStyle[] = ["typical"];

interface LiveChatSettingsFormProps {
  liveChatSettings: LiveChatSettings;
  updateUserSettingsOnEditting: (settings: Partial<UserSettings>) => void;
}

export function LiveChatSettingsForm({
  liveChatSettings,
  updateUserSettingsOnEditting,
}: LiveChatSettingsFormProps) {
  return (
    <div>
      <div>ライブチャット</div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={liveChatSettings.useLiveChatDisplay}
            onChange={(e) => {
              updateUserSettingsOnEditting({ useLiveChatDisplay: e.target.checked });
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
                updateUserSettingsOnEditting({ displayStyle: style });
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
              updateUserSettingsOnEditting({ authorIconVisibility: e.target.checked });
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
              updateUserSettingsOnEditting({ authorNameVisibility: e.target.checked });
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
              updateUserSettingsOnEditting({ membershipBadgeVisibility: e.target.checked });
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
              updateUserSettingsOnEditting({ decorateFirstChat: e.target.checked });
            }}
          />
          最初の書き込みを目立たせる
        </label>
      </div>
    </div>
  );
}
