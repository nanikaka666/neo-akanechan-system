import { CSSProperties } from "react";
import { LiveLaunchProperties } from "../../../../types/liveLaunchProperties";
import { Mode } from "./LiveControlPanel";
import { CommentViewer } from "./commentViewer/CommentViewer";
import { Rankings } from "./rankings/Rankings";

const displayNone: CSSProperties = { display: "none" };

export function MainContents({
  liveLaunchProperties,
  mode,
}: {
  liveLaunchProperties: LiveLaunchProperties;
  mode: Mode;
}) {
  return (
    <div style={{ position: "absolute", top: 0, left: "100px", width: `calc(100vw - 100px)` }}>
      <div style={mode !== "commentViewer" ? displayNone : undefined}>
        <CommentViewer />
      </div>
      <div style={mode !== "chanceTime" ? displayNone : undefined}>Chance Time</div>
      <div style={mode !== "rankings" ? displayNone : undefined}>
        <Rankings />
      </div>
      <div style={mode !== "neighborhoods" ? displayNone : undefined}>Neighborhoods</div>
    </div>
  );
}
