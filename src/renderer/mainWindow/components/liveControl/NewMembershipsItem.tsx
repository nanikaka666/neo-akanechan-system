import { NewMembership } from "../../../../ipcEvent";
import { Author } from "./Author";

export function NewMembershipsItem({ item }: { item: NewMembership }) {
  return (
    <div style={{ backgroundColor: "green" }}>
      <Author author={item.author} />
      <div>{item.displayMessage}</div>
    </div>
  );
}
