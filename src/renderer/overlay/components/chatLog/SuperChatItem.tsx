import { OptionLabel } from "../../../../types/competition";
import { SuperChat } from "../../../../types/liveChatItem";
import { Author } from "./Author";

interface SuperChatItemProps {
  item: SuperChat;
  votedTo?: OptionLabel;
}

export function SuperChatItem({ item, votedTo }: SuperChatItemProps) {
  const tierClassName = `tier-${item.tier.level}`;

  return (
    <div className={`chat-log-item super ${tierClassName}`}>
      <Author author={item.author} votedTo={votedTo} />
      <div className="amount">{item.amount}</div>
      <div className="message">{item.userComment}</div>
    </div>
  );
}
