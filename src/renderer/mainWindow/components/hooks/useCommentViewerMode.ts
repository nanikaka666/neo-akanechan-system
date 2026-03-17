import { useState } from "react";
import { ViewerMode } from "../liveControlPanel/commentViewer/ViewerModeSelector";

export function useCommentViewerMode() {
  const [viewerMode, setViewerMode] = useState<ViewerMode>("text");

  const modeUpdator = (mode: ViewerMode) => {
    setViewerMode((_) => mode);
  };

  return [viewerMode, modeUpdator] as const;
}
