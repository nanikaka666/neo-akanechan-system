import { CSSProperties } from "react";
import { ChannelHavingClosestLive } from "../../../../ipcEvent";
import { UserSettings } from "../../../../main/userSettings";
import { Mode } from "./LiveControlPanel";

const displayNone: CSSProperties = { display: "none" };

export function MainContents({
  channelHavingClosestLive,
  userSettings,
  mode,
}: {
  channelHavingClosestLive: ChannelHavingClosestLive;
  userSettings: UserSettings;
  mode: Mode;
}) {
  return (
    <div style={{ position: "absolute", top: 0, left: "100px" }}>
      <div style={mode !== "commentViewer" ? displayNone : undefined}>Comment Viewer</div>
      <div style={mode !== "chanceTime" ? displayNone : undefined}>Chance Time</div>
      <div style={mode !== "rankings" ? displayNone : undefined}>Rankings</div>
      <div style={mode !== "neighborhoods" ? displayNone : undefined}>Neighborhoods</div>
    </div>
  );
}
