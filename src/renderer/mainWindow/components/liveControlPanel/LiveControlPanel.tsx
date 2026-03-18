import { useEffect } from "react";
import { SideBar } from "./SideBar";
import { MainContents } from "./MainContents";
import { useLiveLaunchProperties } from "../../../hooks/useLiveLaunchProperties";
import { useLiveSettings } from "../../../hooks/useLiveSettings";
import { useMainContentsTab } from "../hooks/useMainContentsTab";

export function LiveControlPanel() {
  const liveLaunchProperties = useLiveLaunchProperties();
  const liveSettings = useLiveSettings();
  const [currentMainContents, switchMainContents, allContentsNames] = useMainContentsTab();

  useEffect(() => {
    window.ipcApi.requestStartDataFetch().then(console.log);
  }, []);

  return liveLaunchProperties && liveSettings ? (
    <>
      <SideBar
        liveLaunchProperties={liveLaunchProperties}
        currentMainContents={currentMainContents}
        switchMainContents={switchMainContents}
        allContentsNames={allContentsNames}
      />
      <MainContents
        liveSettings={liveSettings}
        currentMainContents={currentMainContents}
        allContentsNames={allContentsNames}
      />
    </>
  ) : (
    <div>Now Loading</div>
  );
}
