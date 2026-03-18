import { useEffect, useState } from "react";
import { UserSettings } from "../../../../types/userSettings";
import { UserSettingsForm } from "./UserSettingsForm";

interface UserSettingsFormLoaderProps {
  turnOff: () => void;
}

export function UserSettingsFormLoader({ turnOff }: UserSettingsFormLoaderProps) {
  const [userSettings, setUserSettings] = useState<UserSettings>();

  useEffect(() => {
    window.ipcApi.requestUserSettings().then((res) => {
      setUserSettings((_) => res);
    });
    const remover = window.ipcApi.registerUpdatedUserSettingsListener((e, settings) => {
      setUserSettings((_) => settings);
    });
    return () => remover();
  }, []);

  return userSettings ? (
    <UserSettingsForm userSettings={userSettings} turnOff={turnOff} />
  ) : (
    <div>Now Loading...</div>
  );
}
