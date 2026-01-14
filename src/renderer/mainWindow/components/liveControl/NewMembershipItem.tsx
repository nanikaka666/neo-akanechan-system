import { NewMembership } from "../../../../types/ipcEvent";
import { Author } from "./Author";

export function NewMembershipItem({ item }: { item: NewMembership }) {
  return (
    <div style={{ backgroundColor: "green" }}>
      <Author author={item.author} />
      <div>{item.displayMessage}</div>
      <div>{item.memberLevelName}</div>
    </div>
  );
}
