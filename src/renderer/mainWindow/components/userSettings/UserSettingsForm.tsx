import { useState, MouseEvent, useEffect, useMemo } from "react";
import { UserSettings } from "../../../../main/userSettings";
import { LiveChatSettingsForm } from "./LiveChatSettingsForm";
import { GoalsSettingsForm } from "./GoalsSettingsForm";
import { Channel } from "../../../../main/youtubeApi/model";

export function UserSettingsForm({
  channelSummary,
  userSettings,
}: {
  channelSummary: Channel;
  userSettings: UserSettings;
}) {
  const originalUserSettings = useMemo<UserSettings>(() => {
    return { ...userSettings };
  }, [userSettings]);
  const [currentUserSettings, setCurrentUserSettings] =
    useState<UserSettings>(originalUserSettings);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  useEffect(() => {
    window.ipcApi
      .requestCheckHavingDifferenceAmongUserSettings(originalUserSettings, currentUserSettings)
      .then((res) => {
        setIsSaveDisabled((_) => !res);
      });
  }, [currentUserSettings, originalUserSettings]);

  async function onClick(e: MouseEvent) {
    e.preventDefault();
    await window.ipcApi.requestSaveUserSettings(currentUserSettings);
    // todo: Now saving message should be displayed.
    console.log("User settings saved.");
  }

  return (
    <div>
      <div>User Settings Form</div>
      <LiveChatSettingsForm
        liveChatSettings={currentUserSettings}
        setCurrentUserSettings={setCurrentUserSettings}
      />
      <GoalsSettingsForm
        goalsSettings={currentUserSettings}
        setCurrentUserSettings={setCurrentUserSettings}
      />
      <button onClick={onClick} disabled={isSaveDisabled}>
        Save
      </button>
    </div>
  );
}
