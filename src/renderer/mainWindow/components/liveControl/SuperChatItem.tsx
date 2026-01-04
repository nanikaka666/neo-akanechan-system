import { ExtendedChatItemSuperChat } from "../../../../ipcEvent";
import { Author } from "./Author";
import { FocusForm } from "./FocusForm";
import { Messages } from "./Messages";

export function SuperChatItem({ item }: { item: ExtendedChatItemSuperChat }) {
  return (
    <div style={{ backgroundColor: `#${item.superChat.color.hex}` }}>
      <Author author={item.author} />

      <span style={{ fontWeight: "bold", fontSize: "24px" }}>{item.superChat.amount}</span>

      {item.messages && <Messages messages={item.messages} />}
      <FocusForm item={item} />
    </div>
  );
}
