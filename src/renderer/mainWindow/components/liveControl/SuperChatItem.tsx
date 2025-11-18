import { ExtendedChatItemSuperChat } from "../../../../ipcEvent";
import { Author } from "./Author";

export function SuperChatItem({ item }: { item: ExtendedChatItemSuperChat }) {
  return (
    <div style={{ backgroundColor: `#${item.superChat.color.hex}` }}>
      <Author author={item.author} />

      <span style={{ fontWeight: "bold", fontSize: "24px" }}>{item.superChat.amount}</span>

      {item.messages &&
        item.messages.map((messageItem, idx) => {
          return messageItem.type === "text" ? (
            messageItem.text
          ) : (
            <img style={{ width: "16px" }} src={messageItem.images[0].url} key={idx} />
          );
        })}
    </div>
  );
}
