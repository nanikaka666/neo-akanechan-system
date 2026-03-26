import { useState } from "react";

export type MainContentsName = "competition" | "rankings" | "goals";

export function useMainContentsTab() {
  const [currentMainContents, setCurrentMainContents] = useState<MainContentsName>("goals");
  const switchMainContents = (to: MainContentsName) => setCurrentMainContents((_) => to);

  const allContentsNames: MainContentsName[] = ["competition", "rankings", "goals"];

  return [currentMainContents, switchMainContents, allContentsNames] as const;
}
