import { CSSProperties, Dispatch, SetStateAction } from "react";
import { ChannelHavingClosestLive } from "../../../../ipcEvent";
import { UserSettings } from "../../../../main/userSettings";
import { Mode } from "./LiveControlPanel";

const selectedStyle: CSSProperties = { backgroundColor: "orange" };

export function SideBar({
  channelHavingClosestLive,
  userSettings,
  mode,
  setMode,
}: {
  channelHavingClosestLive: ChannelHavingClosestLive;
  userSettings: UserSettings;
  mode: Mode;
  setMode: Dispatch<SetStateAction<Mode>>;
}) {
  return (
    <div style={{ width: "100px", height: "100%", position: "absolute", top: 0, left: 0 }}>
      <div>
        <img src={channelHavingClosestLive.closestLive.thumbnail} style={{ width: "100px" }}></img>
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
    </div>
  );
}
