import { CSSProperties } from "react";
import { Mode } from "./LiveControlPanel";
import { CommentViewer } from "./commentViewer/CommentViewer";
import { Rankings } from "./rankings/Rankings";
import { Goals } from "./goals/Goals";
import { LiveSettings } from "../../../../types/liveSettings";
import { Competition } from "./competition/Competition";

const displayNone: CSSProperties = { display: "none" };

interface MainContentsProps {
  liveSettings: LiveSettings;
  mode: Mode;
}

export function MainContents({ liveSettings, mode }: MainContentsProps) {
  return (
    <div style={{ position: "absolute", top: 0, left: "100px", width: `calc(100vw - 100px)` }}>
      <div style={mode !== "commentViewer" ? displayNone : undefined}>
        <CommentViewer />
      </div>
      <div style={mode !== "competition" ? displayNone : undefined}>
        <Competition />
      </div>
      <div style={mode !== "rankings" ? displayNone : undefined}>
        <Rankings />
      </div>
      <div style={mode !== "goals" ? displayNone : undefined}>
        <Goals liveSettings={liveSettings} />
      </div>
    </div>
  );
}
