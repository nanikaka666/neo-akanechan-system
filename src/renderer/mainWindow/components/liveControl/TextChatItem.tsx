import { ExtendedChatItemText } from "../../../../ipcEvent";
import { Author } from "./Author";
import { Messages } from "./Messages";
import { StockForm } from "./StockForm";
import { FocusForm } from "./FocusForm";

export function TextChatItem({ item }: { item: ExtendedChatItemText }) {
  return (
    <div style={item.isFirst ? { backgroundColor: "yellowgreen" } : {}}>
      <Author author={item.author} />
      <Messages messages={item.messages} />
      <StockForm item={item} />
      <FocusForm item={item} />
    </div>
  );
}
