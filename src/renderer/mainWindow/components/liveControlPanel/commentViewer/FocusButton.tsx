import { FocusedOnChatItem } from "../../../../../types/liveChatItem";
import { useButton } from "../../../hooks/useButton";

interface FocusButtonProps {
  item: FocusedOnChatItem;
}

export function FocusButton({ item }: FocusButtonProps) {
  const [disabled, disable, enable] = useButton();

  return (
    <button
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        disable();
        window.ipcApi.mainWindow.commentViewer.requestUpdateFocus(item).then(() => enable());
      }}
    >
      フォーカスする
    </button>
  );
}
