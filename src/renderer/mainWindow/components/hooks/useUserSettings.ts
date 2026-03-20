import { useState, useEffect } from "react";
import { UserSettings } from "../../../../types/userSettings";

export function useUserSettings() {
  const [userSettings, setUserSettings] = useState<UserSettings>();

  useEffect(() => {
    window.ipcApi.lcp.requestUserSettings().then((res) => {
      setUserSettings((_) => res);
    });
    const remover = window.ipcApi.lcp.registerUpdatedUserSettingsListener((e, settings) => {
      setUserSettings((_) => settings);
    });
    return () => remover();
  }, []);

  return userSettings;
}
