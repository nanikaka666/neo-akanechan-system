import { useState } from "react";
import { LiveLaunchProperties } from "../../../../ipcEvent";
import { SideBar } from "./SideBar";
import { MainContents } from "./MainContents";

export type Mode = "commentViewer" | "chanceTime" | "rankings" | "neighborhoods";

export function LiveControlPanel({
  liveLaunchProperties,
}: {
  liveLaunchProperties: LiveLaunchProperties;
}) {
  const [mode, setMode] = useState<Mode>("commentViewer");

  return (
    <>
      <SideBar liveLaunchProperties={liveLaunchProperties} mode={mode} setMode={setMode} />
      <MainContents liveLaunchProperties={liveLaunchProperties} mode={mode} />
    </>
  );
}
