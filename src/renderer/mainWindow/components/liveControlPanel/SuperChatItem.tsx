import { ExtendedChatItemSuperChat } from "../../../../types/liveChatItem";
import { Author } from "./Author";
import { FocusForm } from "./FocusForm";

export function SuperChatItem({ item }: { item: ExtendedChatItemSuperChat }) {
  return (
    <div style={{ backgroundColor: `#${item.tier.hex}` }}>
      <Author author={item.author} />

      <span style={{ fontWeight: "bold", fontSize: "24px" }}>{item.amount}</span>

      {item.displayMessage}
      <FocusForm item={item} />
    </div>
  );
}
