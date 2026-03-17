import { Dispatch, SetStateAction } from "react";

export type ViewerMode =
  | "text"
  | "superchatAndStickers"
  | "stocks"
  | "membershipsAndGifts"
  | "focus";

export interface ViewerModeSelectOption {
  viewerMode: ViewerMode;
  label: string;
  itemNum: number;
}

export function ViewerModeSelector({
  currentViewerMode,
  options,
  setViewerMode,
}: {
  currentViewerMode: ViewerMode;
  options: ViewerModeSelectOption[];
  setViewerMode: Dispatch<SetStateAction<ViewerMode>>;
}) {
  return (
    <div style={{ height: "50px", display: "flex" }}>
      {options.map((option) => {
        return (
          <div
            key={option.viewerMode}
            style={
              option.viewerMode === currentViewerMode
                ? { backgroundColor: "yellow" }
                : option.itemNum === 0
                  ? { backgroundColor: "gray" }
                  : {}
            }
            onClick={() => {
              if (option.itemNum === 0) {
                return;
              }
              setViewerMode((_) => option.viewerMode);
            }}
          >
            {`${option.label} (${option.itemNum})`}
          </div>
        );
      })}
    </div>
  );
}
