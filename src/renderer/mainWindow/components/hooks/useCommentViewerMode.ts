import { useState } from "react";

export type ViewerMode =
  | "text"
  | "superchatAndStickers"
  | "stocks"
  | "membershipsAndGifts"
  | "focus";

export function useCommentViewerMode() {
  const [currentViewerMode, setCurrentViewerMode] = useState<ViewerMode>("text");

  const viewerModeUpdator = (mode: ViewerMode) => {
    setCurrentViewerMode((_) => mode);
  };

  const allViewerMode: ViewerMode[] = [
    "text",
    "superchatAndStickers",
    "stocks",
    "membershipsAndGifts",
    "focus",
  ];

  return [currentViewerMode, viewerModeUpdator, allViewerMode] as const;
}
