import { useState, useEffect, useMemo } from "react";
import { UserSettings } from "../../../../types/userSettings";
import { LiveChatSettingsForm } from "./LiveChatSettingsForm";
import { GoalsSettingsForm } from "./GoalsSettingsForm";

interface UserSettingsFormProps {
  userSettings: UserSettings;
  turnOff: () => void;
}

export function UserSettingsForm({ userSettings, turnOff }: UserSettingsFormProps) {
  const originalUserSettings = useMemo<UserSettings>(() => {
    return { ...userSettings };
  }, [userSettings]);
  const [currentUserSettings, setCurrentUserSettings] =
    useState<UserSettings>(originalUserSettings);

  const updateUserSettingsOnEditting = (settings: Partial<UserSettings>) => {
    setCurrentUserSettings((prev) => {
      return { ...prev, ...settings };
    });
  };

  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  useEffect(() => {
    window.ipcApi
      .requestCheckHavingDifferenceAmongUserSettings(originalUserSettings, currentUserSettings)
      .then((res) => {
        setIsSaveDisabled((_) => !res);
      });
  }, [currentUserSettings, originalUserSettings]);

  return (
    <div>
      <div>User Settings Form</div>
      <LiveChatSettingsForm
        liveChatSettings={currentUserSettings}
        updateUserSettingsOnEditting={updateUserSettingsOnEditting}
      />
      <GoalsSettingsForm
        goalsSettings={currentUserSettings}
        updateUserSettingsOnEditting={updateUserSettingsOnEditting}
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          window.ipcApi.requestSaveUserSettings(currentUserSettings).then(() => turnOff());
        }}
        disabled={isSaveDisabled}
      >
        Save
      </button>
    </div>
  );
}
