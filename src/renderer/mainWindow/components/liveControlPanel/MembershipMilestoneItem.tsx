import { MembershipMilestone } from "../../../../types/liveChatItem";
import { Author } from "./Author";

export function MembershipMilestoneItem({ item }: { item: MembershipMilestone }) {
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
