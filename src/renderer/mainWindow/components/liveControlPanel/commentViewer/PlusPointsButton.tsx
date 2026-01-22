import {
  ExtendedChatItemSuperChat,
  ExtendedChatItemSuperSticker,
  ExtendedChatItemText,
} from "../../../../../types/liveChatItem";
import { useState } from "react";

export function PlusPointsButton({
  item,
}: {
  item: ExtendedChatItemText | ExtendedChatItemSuperChat | ExtendedChatItemSuperSticker;
}) {
  const [disabled, setDisabled] = useState(false);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        setDisabled((_) => true);
        window.ipcApi.requestPlusPoints(item);
        setTimeout(() => {
          setDisabled((_) => false);
        }, 200);
      }}
      disabled={disabled}
    >
      +10 Points
    </button>
  );
}
