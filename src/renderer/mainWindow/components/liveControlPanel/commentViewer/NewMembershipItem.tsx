import { NewMembership } from "../../../../../types/liveChatItem";
import { Author } from "./Author";

interface NewMembershipItemProps {
  item: NewMembership;
}

export function NewMembershipItem({ item }: NewMembershipItemProps) {
  return (
    <div className="item new-membership">
      <div className="contents">
        <Author author={item.author} />
        <div>{item.memberLevelName}</div>
        <div>新規メンバーシップ登録</div>
      </div>
    </div>
  );
}
