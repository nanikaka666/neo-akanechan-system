import { useEffect, useState } from "react";
import { SideBar } from "./SideBar";
import { MainContents } from "./MainContents";
import { useLiveLaunchProperties } from "../../../hooks/useLiveLaunchProperties";
import { useLiveSettings } from "../../../hooks/useLiveSettings";

export type Mode = "commentViewer" | "competition" | "rankings" | "goals";

export function LiveControlPanel() {
  const liveLaunchProperties = useLiveLaunchProperties();
  const liveSettings = useLiveSettings();
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
