import { ExtendedChatItemText } from "../../../../../types/liveChatItem";
import { useButton } from "../../hooks/useButton";

export function StockButton({ item }: { item: ExtendedChatItemText }) {
  const [disabled, disable, enable] = useButton();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        disable();
        window.ipcApi.requestAddStock(item).then(() => enable());
      }}
      disabled={disabled}
    >
      ストックする
    </button>
  );
}
