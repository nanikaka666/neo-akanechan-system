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
  disabled: boolean;
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
                : option.disabled
                  ? { backgroundColor: "gray" }
                  : {}
            }
            onClick={() => {
              if (option.disabled) {
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
