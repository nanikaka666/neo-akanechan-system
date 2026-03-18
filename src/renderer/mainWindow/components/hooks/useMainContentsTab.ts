import { useState } from "react";

export type MainContentsName = "commentViewer" | "competition" | "rankings" | "goals";

export function useMainContentsTab() {
  const [currentMainContents, setCurrentMainContents] = useState<MainContentsName>("commentViewer");
  const switchMainContents = (to: MainContentsName) => setCurrentMainContents((_) => to);

  const allContentsNames: MainContentsName[] = [
    "commentViewer",
    "competition",
    "rankings",
    "goals",
  ];

  return [currentMainContents, switchMainContents, allContentsNames] as const;
}
