import { FocusedOnChatItem } from "../../../../types/ipcEvent";
import { SuperChatItem } from "./SuperChatItem";
import { SuperStickerItem } from "./SuperStickerItem";
import { TextChatItem } from "./TextChatItem";

export function FocusItem({ item }: { item: FocusedOnChatItem }) {
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
