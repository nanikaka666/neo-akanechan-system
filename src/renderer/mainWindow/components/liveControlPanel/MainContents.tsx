import { CSSProperties } from "react";
import { CommentViewer } from "./commentViewer/CommentViewer";
import { Rankings } from "./rankings/Rankings";
import { Goals } from "./goals/Goals";
import { LiveSettings } from "../../../../types/liveSettings";
import { Competition } from "./competition/Competition";
import { MainContentsName } from "../../hooks/useMainContentsTab";

const displayNone: CSSProperties = { display: "none" };

interface MainContentsProps {
  liveSettings: LiveSettings;
  currentMainContents: MainContentsName;
  allContentsNames: MainContentsName[];
}

export function MainContents({
  liveSettings,
  currentMainContents,
  allContentsNames,
}: MainContentsProps) {
  return (
    <div style={{ position: "absolute", top: 0, left: "100px", width: `calc(100vw - 100px)` }}>
      {allContentsNames.map((contentsName) => {
        return (
          <div key={contentsName} style={contentsName === currentMainContents ? {} : displayNone}>
            {contentsName === "commentViewer" ? (
              <CommentViewer />
            ) : contentsName === "competition" ? (
              <Competition />
            ) : contentsName === "rankings" ? (
              <Rankings />
            ) : (
              <Goals liveSettings={liveSettings} />
            )}
          </div>
        );
      })}
    </div>
  );
}
