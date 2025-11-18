import { ExtendedChatItemText } from "../../../../ipcEvent";
import { Author } from "./Author";

export function TextChatItem({ item }: { item: ExtendedChatItemText }) {
  return (
    <div style={item.isFirst ? { backgroundColor: "yellowgreen" } : {}}>
      <Author author={item.author} />

      {item.messages.map((messageItem, idx) => {
        return messageItem.type === "text" ? (
          messageItem.text
        ) : (
          <img style={{ width: "16px" }} src={messageItem.images[0].url} key={idx} />
        );
      })}
    </div>
  );
}
