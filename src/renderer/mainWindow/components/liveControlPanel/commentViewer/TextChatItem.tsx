import { ExtendedChatItemText } from "../../../../../types/liveChatItem";
import { Author } from "./Author";
import { StockForm } from "./StockForm";
import { FocusForm } from "./FocusForm";

interface TextChatItemProps {
  item: ExtendedChatItemText;
}

export function TextChatItem({ item }: TextChatItemProps) {
  return (
    <div className={`item ${item.isFirst && "first"}`}>
      <div className="contents">
        <Author author={item.author} />
        <span>{item.displayMessage}</span>
      </div>
      <div className="buttons">
        <StockForm item={item} />
        <FocusForm item={item} />
      </div>
    </div>
  );
}
