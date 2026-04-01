import { MembershipMilestone } from "../../../../../types/liveChatItem";
import { Author } from "./Author";

interface MembershipMilestoneItemProps {
  item: MembershipMilestone;
}

export function MembershipMilestoneItem({ item }: MembershipMilestoneItemProps) {
  return (
    <div className="item milestone">
      <div className="contents">
        <Author author={item.author} />
        <div>{item.memberLevelName}</div>
        <div>{item.memberMonth}ヶ月</div>
        <div>{item.userComment}</div>
      </div>
    </div>
  );
}
