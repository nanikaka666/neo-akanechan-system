import { SuperChatItem } from "../chatLog/SuperChatItem";
import { SuperStickerItem } from "../chatLog/SuperStickerItem";
import { TextItem } from "../chatLog/TextItem";
import { useFocusItem } from "../hooks/useFocusItem";

export function FocusView() {
  const focusItem = useFocusItem();

  return (
    focusItem && (
      <div className="focus-view-container">
        <div className="focus-view" key={focusItem.id.id}>
          {focusItem.type === "text" ? (
            <TextItem item={focusItem} />
          ) : focusItem.type === "superChat" ? (
            <SuperChatItem item={focusItem} />
          ) : (
            <SuperStickerItem item={focusItem} />
          )}
        </div>
      </div>
    )
  );
}
