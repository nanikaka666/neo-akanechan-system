import { ExtendedChatItemSuperSticker } from "../../../../ipcEvent";
import { Author } from "./Author";

export function SuperStickerItem({ item }: { item: ExtendedChatItemSuperSticker }) {
  return (
    <div style={{ backgroundColor: `#${item.superSticker.color.hex}` }}>
      <Author author={item.author} />

      <span style={{ fontWeight: "bold", fontSize: "24px" }}>{item.superSticker.amount}</span>

      {item.messages &&
        item.messages.map((messageItem, idx) => {
          return messageItem.type === "text" ? (
            messageItem.text
          ) : (
            <img style={{ width: "16px" }} src={messageItem.images[0].url} key={idx} />
          );
        })}

      <img src={item.superSticker.thumbnails[0].url} style={{ width: "64px" }} />
    </div>
  );
}
