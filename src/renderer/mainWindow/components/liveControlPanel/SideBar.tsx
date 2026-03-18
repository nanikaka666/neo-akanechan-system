import { CSSProperties } from "react";
import { LiveLaunchProperties } from "../../../../types/liveLaunchProperties";
import { SideBarInfoArea } from "./SideBarInfoArea";
import { QuitLiveButton } from "./QuitLiveButton";
import { MainContentsName } from "../hooks/useMainContentsTab";

const selectedStyle: CSSProperties = { backgroundColor: "orange" };

interface SideBarProps {
  liveLaunchProperties: LiveLaunchProperties;
  currentMainContents: MainContentsName;
  switchMainContents: (to: MainContentsName) => void;
  allContentsNames: MainContentsName[];
}

export function SideBar({
  liveLaunchProperties,
  currentMainContents,
  switchMainContents,
  allContentsNames,
}: SideBarProps) {
  return (
    <div style={{ width: "100px", height: "100%", position: "absolute", top: 0, left: 0 }}>
      <div>
        <img src={liveLaunchProperties.live.thumbnailUrl} style={{ width: "100px" }}></img>
      </div>
      {allContentsNames.map((contentsName) => {
        return (
          <div
            key={contentsName}
            onClick={() => switchMainContents(contentsName)}
            style={currentMainContents === contentsName ? selectedStyle : {}}
          >
            {contentsName === "commentViewer"
              ? "コメントビューワー"
              : contentsName === "competition"
                ? "コンペティション"
                : contentsName === "rankings"
                  ? "ランキング"
                  : "目標"}
          </div>
        );
      })}
      <SideBarInfoArea />
      <QuitLiveButton liveLaunchProperties={liveLaunchProperties} />
    </div>
  );
}
