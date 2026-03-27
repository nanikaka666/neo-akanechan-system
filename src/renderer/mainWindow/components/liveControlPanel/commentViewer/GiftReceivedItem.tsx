import { GiftReceived } from "../../../../../types/liveChatItem";
import { Author } from "./Author";

interface GiftReceivedItemProps {
  item: GiftReceived;
}

export function GiftReceivedItem({ item }: GiftReceivedItemProps) {
  return (
    <div className="item gift-received">
      <div className="contents">
        <Author author={item.author} />
        <div>{item.displayMessage}</div>
      </div>
    </div>
  );
}
