import { MembershipGift } from "../../../../../types/liveChatItem";
import { Author } from "./Author";

interface MembershipGiftItemProps {
  item: MembershipGift;
}

export function MembershipGiftItem({ item }: MembershipGiftItemProps) {
  return (
    <div style={{ backgroundColor: "pink" }}>
      <Author author={item.author} />
      <div>{item.displayMessage}</div>
      <div>Gift Num: {item.giftCount}</div>
    </div>
  );
}
