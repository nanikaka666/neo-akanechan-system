import { NewMembership } from "../../../../../types/liveChatItem";
import { Author } from "./Author";

interface NewMembershipItemProps {
  item: NewMembership;
}

export function NewMembershipItem({ item }: NewMembershipItemProps) {
  return (
    <div style={{ backgroundColor: "green" }}>
      <Author author={item.author} />
      <div>{item.displayMessage}</div>
      <div>{item.memberLevelName}</div>
    </div>
  );
}
