import { ExtendedChatItemText } from "../../../../types/ipcEvent";
import { Author } from "./Author";
import { StockForm } from "./StockForm";
import { FocusForm } from "./FocusForm";

export function TextChatItem({ item }: { item: ExtendedChatItemText }) {
  return (
    <div style={item.isFirst ? { backgroundColor: "yellowgreen" } : {}}>
      <Author author={item.author} />
      <div>{item.displayMessage}</div>
      <StockForm item={item} />
      <FocusForm item={item} />
    </div>
  );
}
