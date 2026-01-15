import { useState } from "react";
import { ExtendedChatItemText } from "../../../../../types/liveChatItem";

export function StockButton({ item }: { item: ExtendedChatItemText }) {
  const [disabled, setDisabled] = useState(false);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDisabled((_) => true);
        window.ipcApi.requestAddStock(item);
      }}
      disabled={disabled}
    >
      ストックする
    </button>
  );
}
