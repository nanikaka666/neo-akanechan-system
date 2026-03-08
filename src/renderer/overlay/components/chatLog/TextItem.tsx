import { OptionLabel } from "../../../../types/competition";
import { TextMessageChat } from "../../../../types/liveChatItem";
import { Author } from "./Author";

interface TextItemProps {
  item: TextMessageChat;
  votedTo?: OptionLabel;
}

export function TextItem({ item, votedTo }: TextItemProps) {
  return (
    <div className="chat-log-item text">
      <Author author={item.author} votedTo={votedTo} />
      <div className="message">{item.displayMessage}</div>
    </div>
  );
}
