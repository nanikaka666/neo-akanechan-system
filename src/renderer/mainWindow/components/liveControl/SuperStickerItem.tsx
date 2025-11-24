import { ExtendedChatItemSuperSticker } from "../../../../ipcEvent";
import { Author } from "./Author";
import { FocusForm } from "./FocusForm";
import { Messages } from "./Messages";

export function SuperStickerItem({ item }: { item: ExtendedChatItemSuperSticker }) {
  return (
    <div style={{ backgroundColor: `#${item.superSticker.color.hex}` }}>
      <Author author={item.author} />

      <span style={{ fontWeight: "bold", fontSize: "24px" }}>{item.superSticker.amount}</span>

      {item.messages && <Messages messages={item.messages} />}

      <img src={item.superSticker.thumbnails[0].url} style={{ width: "64px" }} />
      <FocusForm item={item} />
    </div>
  );
}
