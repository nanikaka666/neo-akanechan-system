import { ExtendedChatItemSuperSticker } from "../../../../ipcEvent";
import { Author } from "./Author";
import { FocusForm } from "./FocusForm";

export function SuperStickerItem({ item }: { item: ExtendedChatItemSuperSticker }) {
  return (
    <div style={{ backgroundColor: `#${item.tier.hex}` }}>
      <Author author={item.author} />

      <span style={{ fontWeight: "bold", fontSize: "24px" }}>{item.amount}</span>

      {item.displayMessage}

      <FocusForm item={item} />
    </div>
  );
}
