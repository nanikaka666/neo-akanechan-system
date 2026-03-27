import { ExtendedChatItemSuperChat } from "../../../../../types/liveChatItem";
import { Author } from "./Author";
import { FocusForm } from "./FocusForm";

interface SuperChatItemProps {
  item: ExtendedChatItemSuperChat;
}

export function SuperChatItem({ item }: SuperChatItemProps) {
  const tier = `tier-${item.tier.level}`;
  return (
    <div className={`item super-chat ${tier}`}>
      <div className="contents">
        <Author author={item.author} />
        <span className="amount">{item.amount}</span>
        <span>{item.userComment}</span>
      </div>
      <div className="buttons">
        <FocusForm item={item} />
      </div>
    </div>
  );
}
