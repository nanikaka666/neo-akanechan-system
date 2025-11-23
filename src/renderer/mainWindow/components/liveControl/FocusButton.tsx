import { useEffect, useState } from "react";
import { FocusedOnChatItem } from "../../../../ipcEvent";

export function FocusButton({ item }: { item: FocusedOnChatItem }) {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setDisabled((_) => false);
  }, [item.isFocused]);

  return item.isFocused ? (
    <button
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDisabled((_) => true);
        window.ipcApi.requestUpdateFocus(undefined);
      }}
    >
      フォーカスを外す
    </button>
  ) : (
    <button
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDisabled((_) => true);
        window.ipcApi.requestUpdateFocus(item);
      }}
    >
      フォーカスする
    </button>
  );
}
