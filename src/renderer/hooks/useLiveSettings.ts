import { useEffect, useState } from "react";
import { LiveSettings } from "../../types/liveSettings";

const defaultSettings: LiveSettings = {
  likeCountGoal: {
    maxLevel: 1,
    goalValues: [0, 1],
  },
  viewerCountGoal: {
    maxLevel: 1,
    goalValues: [0, 1],
  },
  subscriberCountGoal: 1,
};

export function useLiveSettings() {
  const [liveSettings, setLiveSettings] = useState<LiveSettings>(defaultSettings);
  useEffect(() => {
    const remover = window.ipcApi.registerLiveSettingsListener((e, liveSettings) => {
      setLiveSettings((_) => liveSettings);
    });
    window.ipcApi.requestSyncLiveSettings();
    return () => remover();
  }, []);

  return liveSettings;
}
