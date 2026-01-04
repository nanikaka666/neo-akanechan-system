import { useState } from "react";
import { FocusedOnChatItem } from "../../../../ipcEvent";

export function FocusButton({ item }: { item: FocusedOnChatItem }) {
  const [disabled, setDisabled] = useState(false);

  return (
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
