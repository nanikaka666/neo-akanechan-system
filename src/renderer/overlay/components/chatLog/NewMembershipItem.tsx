import { OptionLabel } from "../../../../types/competition";
import { NewMembership } from "../../../../types/liveChatItem";
import { Author } from "./Author";

interface NewMembershipItemProps {
  item: NewMembership;
  votedTo?: OptionLabel;
}

export function NewMembershipItem({ item, votedTo }: NewMembershipItemProps) {
  return (
    <div className="chat-log-item new-membership">
      <Author author={item.author} votedTo={votedTo} />
      {item.memberLevelName !== "" && (
        <div className="membership-level-name">{item.memberLevelName}</div>
      )}
      <div className="message">新規メンバーシップ登録</div>
    </div>
  );
}
