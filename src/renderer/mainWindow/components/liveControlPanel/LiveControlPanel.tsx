import { useEffect } from "react";
import { MainContents } from "./MainContents";
import { useLiveLaunchProperties } from "../../hooks/useLiveLaunchProperties";
import { useLiveSettings } from "../../../hooks/useLiveSettings";
import { CommentViewer } from "./commentViewer/CommentViewer";
import { SideBarInfoArea } from "./SideBarInfoArea";

export function LiveControlPanel() {
  const liveLaunchProperties = useLiveLaunchProperties();
  const liveSettings = useLiveSettings();

  useEffect(() => {
    window.ipcApi.mainWindow.requestStartDataFetch().then(console.log);
  }, []);

  return liveLaunchProperties && liveSettings ? (
    <div className="lcp-container">
      <div className="left">
        <div className="header">
          <img src={liveLaunchProperties.live.thumbnailUrl}></img>
          <div>{liveLaunchProperties.live.title}</div>
        </div>
        <SideBarInfoArea />
        <MainContents liveSettings={liveSettings} />
      </div>
      <div className="right">
        <CommentViewer />
      </div>
    </div>
  ) : (
    <div>Now Loading</div>
  );
}
