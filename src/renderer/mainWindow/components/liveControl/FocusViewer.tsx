import { FocusedOnChatItem } from "../../../../ipcEvent";
import { TextChatItem } from "./TextChatItem";
import { SuperChatItem } from "./SuperChatItem";
import { SuperStickerItem } from "./SuperStickerItem";

export function FocusViewer({ focus }: { focus?: FocusedOnChatItem }) {
  return focus ? (
    <div style={{ height: `calc(100vh - 50px)` }}>
      {focus.type === "text" ? (
        <TextChatItem item={focus} />
      ) : focus.type === "superChat" ? (
        <SuperChatItem item={focus} />
      ) : (
        <SuperStickerItem item={focus} />
      )}
    </div>
  ) : (
    <div style={{ height: `calc(100vh - 50px)` }}>フォーカス中のアイテムはありません</div>
  );
}
