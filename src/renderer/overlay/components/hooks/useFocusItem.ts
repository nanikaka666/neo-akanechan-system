import { useState } from "react";
import { FocusViewItem } from "../../../../types/focusView";

export function useFocusItem() {
  const [focusItem, setFocusItem] = useState<FocusViewItem | undefined>();

  return focusItem;
}
