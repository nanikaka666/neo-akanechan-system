import { GiftReceived } from "../../../../types/liveChatItem";
import { Author } from "./Author";

interface GiftReceivedItemProps {
  item: GiftReceived;
}

export function GiftReceivedItem({ item }: GiftReceivedItemProps) {
  return (
    <div className="chat-log-item gift-received">
      <Author author={item.author} />
      {item.receivedMemberLevelName !== "" && (
        <div className="membership-level-name">{item.receivedMemberLevelName}</div>
      )}
      <div className="message">メンバーシップギフトを受け取りました。</div>
    </div>
  );
}
