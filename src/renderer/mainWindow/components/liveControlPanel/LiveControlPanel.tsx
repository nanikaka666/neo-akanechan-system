import { useEffect, useState } from "react";
import { LiveLaunchProperties } from "../../../../types/liveLaunchProperties";
import { SideBar } from "./SideBar";
import { MainContents } from "./MainContents";
import { LiveSettings } from "../../../../types/liveSettings";

export type Mode = "commentViewer" | "chanceTime" | "rankings" | "goals";

export interface LiveControlPanelProps {
  liveLaunchProperties: LiveLaunchProperties;
  liveSettings: LiveSettings;
}

export function LiveControlPanel({ liveLaunchProperties, liveSettings }: LiveControlPanelProps) {
  const [mode, setMode] = useState<Mode>("commentViewer");

  useEffect(() => {
    window.ipcApi.requestStartDataFetch().then(console.log);
  }, [liveLaunchProperties]);

  return (
    <>
      <SideBar liveLaunchProperties={liveLaunchProperties} mode={mode} setMode={setMode} />
      <MainContents
        liveLaunchProperties={liveLaunchProperties}
        liveSettings={liveSettings}
        mode={mode}
      />
    </>
  );
}
