import { useState } from "react";

export type ViewerMode =
  | "text"
  | "superchatAndStickers"
  | "stocks"
  | "membershipsAndGifts"
  | "focus";

export function useCommentViewerMode() {
  const [viewerMode, setViewerMode] = useState<ViewerMode>("text");

  const modeUpdator = (mode: ViewerMode) => {
    setViewerMode((_) => mode);
  };

  return [viewerMode, modeUpdator] as const;
}
