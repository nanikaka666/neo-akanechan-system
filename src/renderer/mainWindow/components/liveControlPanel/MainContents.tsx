import { CSSProperties } from "react";
import { LiveLaunchProperties } from "../../../../types/liveLaunchProperties";
import { Mode } from "./LiveControlPanel";
import { CommentViewer } from "./commentViewer/CommentViewer";
import { Rankings } from "./rankings/Rankings";
import { Goals } from "./goals/Goals";
import { LiveSettings } from "../../../../types/liveSettings";

const displayNone: CSSProperties = { display: "none" };

export interface MainContentsProps {
  liveLaunchProperties: LiveLaunchProperties;
  liveSettings: LiveSettings;
  mode: Mode;
}

export function MainContents({ liveLaunchProperties, liveSettings, mode }: MainContentsProps) {
  return (
    <div style={{ position: "absolute", top: 0, left: "100px", width: `calc(100vw - 100px)` }}>
      <div style={mode !== "commentViewer" ? displayNone : undefined}>
        <CommentViewer />
      </div>
      <div style={mode !== "chanceTime" ? displayNone : undefined}>Chance Time</div>
      <div style={mode !== "rankings" ? displayNone : undefined}>
        <Rankings />
      </div>
      <div style={mode !== "goals" ? displayNone : undefined}>
        <Goals liveSettings={liveSettings} />
      </div>
    </div>
  );
}
