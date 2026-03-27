import { Rankings } from "./rankings/Rankings";
import { Goals } from "./goals/Goals";
import { LiveSettings } from "../../../../types/liveSettings";
import { Competition } from "./competition/Competition";
import { useMainContentsTab } from "../../hooks/useMainContentsTab";

interface MainContentsProps {
  liveSettings: LiveSettings;
}

export function MainContents({ liveSettings }: MainContentsProps) {
  const [currentMainContents, switchMainContents, allContentsNames] = useMainContentsTab();

  return (
    <div className="main-contents">
      <div className="contents-selector">
        {allContentsNames.map((contentsName) => {
          return (
            <div
              key={contentsName}
              onClick={() => switchMainContents(contentsName)}
              className={currentMainContents === contentsName ? "selected" : ""}
            >
              {contentsName === "competition"
                ? "コンペティション"
                : contentsName === "rankings"
                  ? "ランキング"
                  : "目標"}
            </div>
          );
        })}
      </div>
      <div className="contents">
        {allContentsNames.map((contentsName) => {
          return (
            <div
              key={contentsName}
              className={contentsName !== currentMainContents ? "invisible-contents" : ""}
            >
              {contentsName === "competition" ? (
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
    </div>
  );
}
