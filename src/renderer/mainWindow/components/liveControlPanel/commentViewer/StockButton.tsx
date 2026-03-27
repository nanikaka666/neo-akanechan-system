import { ExtendedChatItemText } from "../../../../../types/liveChatItem";
import { useButton } from "../../../hooks/useButton";

interface StockButtonProps {
  item: ExtendedChatItemText;
}

export function StockButton({ item }: StockButtonProps) {
  const [disabled, disable, enable] = useButton();

  return (
    <button
      className="stock"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        disable();
        window.ipcApi.mainWindow.commentViewer.requestAddStock(item).then(() => enable());
      }}
      disabled={disabled}
    >
      ストックする
    </button>
  );
}
