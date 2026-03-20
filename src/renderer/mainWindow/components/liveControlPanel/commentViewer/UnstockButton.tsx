import { ExtendedChatItemText } from "../../../../../types/liveChatItem";
import { useButton } from "../../hooks/useButton";

interface UnstockButtonProps {
  item: ExtendedChatItemText;
}

export function UnstockButton({ item }: UnstockButtonProps) {
  const [disabled, disable, enable] = useButton();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        disable();
        window.ipcApi.lcp.requestRemoveStock(item).then(() => enable());
      }}
      disabled={disabled}
    >
      ストックから外す
    </button>
  );
}
