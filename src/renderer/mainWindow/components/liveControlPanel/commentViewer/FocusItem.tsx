import { FocusedOnChatItem } from "../../../../../types/liveChatItem";
import { SuperChatItem } from "./SuperChatItem";
import { SuperStickerItem } from "./SuperStickerItem";
import { TextChatItem } from "./TextChatItem";

interface FocusItemProps {
  item: FocusedOnChatItem;
}

export function FocusItem({ item }: FocusItemProps) {
  return (
    <div style={{ height: `calc(100vh - 50px)` }}>
      {item.type === "text" ? (
        <TextChatItem item={item} />
      ) : item.type === "superChat" ? (
        <SuperChatItem item={item} />
      ) : (
        <SuperStickerItem item={item} />
      )}
    </div>
  );
}
