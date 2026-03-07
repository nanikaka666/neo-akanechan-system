import { OptionLabel } from "../../../../types/competition";
import { MembershipMilestone } from "../../../../types/liveChatItem";
import { Author } from "./Author";

interface MembershipMilestoneItemProps {
  item: MembershipMilestone;
  votedTo?: OptionLabel;
}

export function MembershipMilestoneItem({ item, votedTo }: MembershipMilestoneItemProps) {
  const membershipLevelName = item.memberLevelName === "" ? "メンバーシップ" : item.memberLevelName;

  return (
    <div className="chat-log-item membership-milestone">
      <Author author={item.author} votedTo={votedTo} />
      <div className="milestone-info">
        <div>{membershipLevelName}</div>
        <div>{item.memberMonth}ヶ月</div>
      </div>
      <div className="sub-message">マイルストーン更新</div>
      <div className="message">{item.userComment}</div>
    </div>
  );
}
