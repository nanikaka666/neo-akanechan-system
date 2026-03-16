import { useEffect, useState } from "react";
import { LiveSettings } from "../../types/liveSettings";

export function useLiveSettings() {
  const [liveSettings, setLiveSettings] = useState<LiveSettings>();
  useEffect(() => {
    const remover = window.ipcApi.registerLiveSettingsListener((e, liveSettings) => {
      setLiveSettings((_) => liveSettings);
    });
    window.ipcApi.requestSyncLiveSettings();
    return () => remover();
  }, []);

  return liveSettings;
}
