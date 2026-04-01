import { CSSProperties } from "react";
import { LiveLaunchProperties } from "../../../../types/liveLaunchProperties";
import { StatisticsArea } from "./StatisticsArea";
import { QuitLiveButton } from "./QuitLiveButton";
import { MainContentsName } from "../../hooks/useMainContentsTab";

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
    <div>
      <div>
        <img src={liveLaunchProperties.live.thumbnailUrl}></img>
      </div>
      {allContentsNames.map((contentsName) => {
        return (
          <div
            key={contentsName}
            onClick={() => switchMainContents(contentsName)}
            style={currentMainContents === contentsName ? selectedStyle : {}}
          >
            {contentsName === "competition"
              ? "コンペティション"
              : contentsName === "rankings"
                ? "ランキング"
                : "目標"}
          </div>
        );
      })}
      {/* <QuitLiveButton liveLaunchProperties={liveLaunchProperties} /> */}
    </div>
  );
}
