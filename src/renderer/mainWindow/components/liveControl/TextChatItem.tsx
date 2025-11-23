import { ExtendedChatItemText } from "../../../../ipcEvent";
import { Author } from "./Author";
import { Messages } from "./Messages";
import { StockButton } from "./StockButton";
import { FocusButton } from "./FocusButton";

export function TextChatItem({ item }: { item: ExtendedChatItemText }) {
  return (
    <div style={item.isFirst ? { backgroundColor: "yellowgreen" } : {}}>
      <Author author={item.author} />
      <Messages messages={item.messages} />
      <StockButton item={item} />
      <FocusButton item={item} />
    </div>
  );
}
