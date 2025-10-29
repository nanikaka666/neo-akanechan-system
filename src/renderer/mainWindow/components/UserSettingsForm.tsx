import { useState, MouseEvent, useEffect, useMemo } from "react";
import { UserSettings } from "../../../main/userSettings";
import { LiveChatSettingsForm } from "./LiveChatSettingsForm";
import { ChannelSummary } from "../../../ipcEvent";

export function UserSettingsForm({
  channelSummary,
  userSettings,
}: {
  channelSummary: ChannelSummary;
  userSettings: UserSettings;
}) {
  const originalUserSettings = useMemo(() => {
    return { ...userSettings };
  }, [userSettings]);
  const [currentUserSettings, setCurrentUserSettings] = useState(originalUserSettings);
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
    await window.ipcApi.registerUserSettings(channelSummary.channelId, currentUserSettings);
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
      <button onClick={onClick} disabled={isSaveDisabled}>
        Save
      </button>
    </div>
  );
}
