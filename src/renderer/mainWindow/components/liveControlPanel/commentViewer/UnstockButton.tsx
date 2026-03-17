import { ExtendedChatItemText } from "../../../../../types/liveChatItem";
import { useButton } from "../../hooks/useButton";

export function UnstockButton({ item }: { item: ExtendedChatItemText }) {
  const [disabled, disable, enable] = useButton();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        disable();
        window.ipcApi.requestRemoveStock(item).then(() => enable());
      }}
      disabled={disabled}
    >
      ストックから外す
    </button>
  );
}
