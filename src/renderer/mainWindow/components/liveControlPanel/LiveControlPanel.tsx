import { useEffect, useState } from "react";
import { SideBar } from "./SideBar";
import { MainContents } from "./MainContents";
import { LiveSettings } from "../../../../types/liveSettings";
import { useLiveLaunchProperties } from "../../../hooks/useLiveLaunchProperties";

export type Mode = "commentViewer" | "competition" | "rankings" | "goals";

interface LiveControlPanelProps {
  liveSettings: LiveSettings;
}

export function LiveControlPanel({ liveSettings }: LiveControlPanelProps) {
  const liveLaunchProperties = useLiveLaunchProperties();
  const [mode, setMode] = useState<Mode>("commentViewer");

  useEffect(() => {
    window.ipcApi.requestStartDataFetch().then(console.log);
  }, []);

  return liveLaunchProperties ? (
    <>
      <SideBar liveLaunchProperties={liveLaunchProperties} mode={mode} setMode={setMode} />
      <MainContents liveSettings={liveSettings} mode={mode} />
    </>
  ) : (
    <div>Now Loading</div>
  );
}
