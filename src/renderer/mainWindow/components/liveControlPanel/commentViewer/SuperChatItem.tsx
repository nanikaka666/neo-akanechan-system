import { ExtendedChatItemSuperChat } from "../../../../../types/liveChatItem";
import { Author } from "./Author";
import { FocusForm } from "./FocusForm";
import { PlusPointsButton } from "./PlusPointsButton";

export function SuperChatItem({ item }: { item: ExtendedChatItemSuperChat }) {
  return (
    <div style={{ backgroundColor: `#${item.tier.hex}` }}>
      <Author author={item.author} />

      <span style={{ fontWeight: "bold", fontSize: "24px" }}>{item.amount}</span>

      {item.displayMessage}
      <FocusForm item={item} />
      <PlusPointsButton item={item} />
    </div>
  );
}
