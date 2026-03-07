import { OptionLabel } from "../../../../types/competition";
import { MembershipGift } from "../../../../types/liveChatItem";
import { Author } from "./Author";

interface MembershipGiftItemProps {
  item: MembershipGift;
  votedTo?: OptionLabel;
}

export function MembershipGiftItem({ item, votedTo }: MembershipGiftItemProps) {
  const membershipLevelName =
    item.giftMemberLevelName === "" ? "メンバーシップ" : item.giftMemberLevelName;
  return (
    <div className="chat-log-item gift">
      <Author author={item.author} votedTo={votedTo} />
      <div className="gift-info">
        <div className="membership-level-name">{membershipLevelName}</div>
        <div className="gift-count">{item.giftCount}</div>
      </div>
      <div className="message">メンバーシップギフトを{item.giftCount}個贈りました。</div>
    </div>
  );
}
