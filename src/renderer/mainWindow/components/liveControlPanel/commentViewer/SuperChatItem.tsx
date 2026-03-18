import { ExtendedChatItemSuperChat } from "../../../../../types/liveChatItem";
import { Author } from "./Author";
import { FocusForm } from "./FocusForm";

interface SuperChatItemProps {
  item: ExtendedChatItemSuperChat;
}

export function SuperChatItem({ item }: SuperChatItemProps) {
  return (
    <div style={{ backgroundColor: `#${item.tier.hex}` }}>
      <Author author={item.author} />

      <span style={{ fontWeight: "bold", fontSize: "24px" }}>{item.amount}</span>

      {item.displayMessage}
      <FocusForm item={item} />
    </div>
  );
}
