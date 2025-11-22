import { useEffect, useState } from "react";
import { ExtendedChatItemText } from "../../../../ipcEvent";

export function StockButton({ item }: { item: ExtendedChatItemText }) {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setDisabled((_) => false);
  }, [item.isStocked]);

  return item.isStocked ? (
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
  ) : (
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
