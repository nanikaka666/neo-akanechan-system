import { useRef, useState } from "react";
import { VirtuosoHandle } from "react-virtuoso";

export function useJumpToLatestButton() {
  const ref = useRef<VirtuosoHandle>(null); // for control scroll position
  const [isShown, setIsShown] = useState(false);
  const onAtBottomStateChanged = (atBottom: boolean) => {
    setIsShown((_) => !atBottom);
  };

  return [ref, isShown, onAtBottomStateChanged] as const;
}
