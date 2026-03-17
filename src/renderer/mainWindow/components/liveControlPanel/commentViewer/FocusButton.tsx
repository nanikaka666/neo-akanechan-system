import { FocusedOnChatItem } from "../../../../../types/liveChatItem";
import { useButton } from "../../hooks/useButton";

export function FocusButton({ item }: { item: FocusedOnChatItem }) {
  const [disabled, disable, enable] = useButton();

  return (
    <button
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        disable();
        window.ipcApi.requestUpdateFocus(item).then(() => enable());
      }}
    >
      フォーカスする
    </button>
  );
}
