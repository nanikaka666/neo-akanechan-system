import { useEffect, useState } from "react";
import { UserSettings } from "../../../../main/userSettings";
import { UserSettingsForm } from "./UserSettingsForm";

export function UserSettingsFormLoader({ turnOff }: { turnOff: () => void }) {
  const [userSettings, setUserSettings] = useState<UserSettings>();

  useEffect(() => {
    window.ipcApi.requestUserSettings().then((res) => {
      setUserSettings((_) => res);
    });
    const remover = window.ipcApi.registerUpdatedUserSettingsListener((e, settings) => {
      setUserSettings((_) => settings);
      turnOff();
    });
    return () => remover();
  }, [turnOff]);

  return userSettings ? (
    <UserSettingsForm userSettings={userSettings} />
  ) : (
    <div>Now Loading...</div>
  );
}
