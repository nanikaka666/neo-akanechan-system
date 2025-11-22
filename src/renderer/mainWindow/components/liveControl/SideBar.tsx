import { CSSProperties, Dispatch, SetStateAction } from "react";
import { LiveLaunchProperties } from "../../../../ipcEvent";
import { Mode } from "./LiveControlPanel";
import { SideBarInfoArea } from "./SideBarInfoArea";
import { QuitLiveButton } from "./QuitLiveButton";

const selectedStyle: CSSProperties = { backgroundColor: "orange" };

export function SideBar({
  liveLaunchProperties,
  mode,
  setMode,
}: {
  liveLaunchProperties: LiveLaunchProperties;
  mode: Mode;
  setMode: Dispatch<SetStateAction<Mode>>;
}) {
  return (
    <div style={{ width: "100px", height: "100%", position: "absolute", top: 0, left: 0 }}>
      <div>
        <img
          src={liveLaunchProperties.channel.closestLive.thumbnail}
          style={{ width: "100px" }}
        ></img>
      </div>
      <div
        onClick={() => setMode((_) => "commentViewer")}
        style={mode === "commentViewer" ? selectedStyle : undefined}
      >
        Comment Viewer
      </div>
      <div
        onClick={() => setMode((_) => "chanceTime")}
        style={mode === "chanceTime" ? selectedStyle : undefined}
      >
        Chance Time
      </div>
      <div
        onClick={() => setMode((_) => "rankings")}
        style={mode === "rankings" ? selectedStyle : undefined}
      >
        Participant Point Rankings
      </div>
      <div
        onClick={() => setMode((_) => "neighborhoods")}
        style={mode === "neighborhoods" ? selectedStyle : undefined}
      >
        Neighborhoods
      </div>
      <SideBarInfoArea />
      <QuitLiveButton liveLaunchProperties={liveLaunchProperties} />
    </div>
  );
}
