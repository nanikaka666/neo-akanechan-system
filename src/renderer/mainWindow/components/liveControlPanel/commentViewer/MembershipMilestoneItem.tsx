import { MembershipMilestone } from "../../../../../types/liveChatItem";
import { Author } from "./Author";

interface MembershipMilestoneItemProps {
  item: MembershipMilestone;
}

export function MembershipMilestoneItem({ item }: MembershipMilestoneItemProps) {
  return (
    <div style={{ backgroundColor: "skyblue" }}>
      <Author author={item.author} />
      <div>{item.displayMessage}</div>
      <div>{item.userComment}</div>
      <div>
        {item.memberLevelName} : {item.memberMonth}
      </div>
    </div>
  );
}
