import { useEffect, useState } from "react";
import { FocusViewItem } from "../../../../types/focusView";

export function useFocusItem() {
  const [focusItem, setFocusItem] = useState<FocusViewItem | undefined>();

  useEffect(() => {
    const remover = window.ipcApi.registerFocusItemListener((_, item) => {
      setFocusItem((_) => item);
    });
    return () => remover();
  }, []);

  return focusItem;
}
