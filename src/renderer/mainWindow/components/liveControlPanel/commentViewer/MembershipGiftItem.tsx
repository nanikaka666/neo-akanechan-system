import { MembershipGift } from "../../../../../types/liveChatItem";
import { Author } from "./Author";

interface MembershipGiftItemProps {
  item: MembershipGift;
}

export function MembershipGiftItem({ item }: MembershipGiftItemProps) {
  return (
    <div className="item gift">
      <div className="contents">
        <Author author={item.author} />
        <div>
          {item.giftMemberLevelName}を{item.giftCount}個贈りました
        </div>
      </div>
    </div>
  );
}
