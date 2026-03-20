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
  const [userSettingsOnEditting, setUserSettingsOnEditting] =
    useState<UserSettings>(originalUserSettings);

  const updateUserSettingsOnEditting = (settings: Partial<UserSettings>) => {
    setUserSettingsOnEditting((prev) => {
      return { ...prev, ...settings };
    });
  };

  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  useEffect(() => {
    window.ipcApi.mainWindow.userSettings
      .requestCheckHavingDifferenceAmongUserSettings(originalUserSettings, userSettingsOnEditting)
      .then((res) => {
        setIsSaveDisabled((_) => !res);
      });
  }, [userSettingsOnEditting, originalUserSettings]);

  return (
    <div>
      <div>User Settings Form</div>
      <LiveChatSettingsForm
        liveChatSettings={userSettingsOnEditting}
        updateUserSettingsOnEditting={updateUserSettingsOnEditting}
      />
      <GoalsSettingsForm
        goalsSettings={userSettingsOnEditting}
        updateUserSettingsOnEditting={updateUserSettingsOnEditting}
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          window.ipcApi.mainWindow.userSettings
            .requestSaveUserSettings(userSettingsOnEditting)
            .then(() => turnOff());
        }}
        disabled={isSaveDisabled}
      >
        Save
      </button>
    </div>
  );
}
