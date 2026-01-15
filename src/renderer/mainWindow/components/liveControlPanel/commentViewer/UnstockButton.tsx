import { useState } from "react";
import { ExtendedChatItemText } from "../../../../../types/liveChatItem";

export function UnstockButton({ item }: { item: ExtendedChatItemText }) {
  const [disabled, setDisabled] = useState(false);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDisabled((_) => true);
        window.ipcApi.requestRemoveStock(item);
      }}
      disabled={disabled}
    >
      ストックから外す
    </button>
  );
}
