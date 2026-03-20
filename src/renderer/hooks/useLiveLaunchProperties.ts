import { useEffect, useState } from "react";
import { LiveLaunchProperties } from "../../types/liveLaunchProperties";

export function useLiveLaunchProperties() {
  const [liveLaunchProperties, setLiveLaunchProperties] = useState<LiveLaunchProperties>();
  useEffect(() => {
    window.ipcApi.mainWindow.requestLiveLaunchProperties().then(setLiveLaunchProperties);
  }, []);
  return liveLaunchProperties;
}
