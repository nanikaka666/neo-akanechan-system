import { ExtendedNewMembership } from "../../../../ipcEvent";
import { Author } from "./Author";

export function NewMembershipsItem({ item }: { item: ExtendedNewMembership }) {
  return (
    <div style={{ backgroundColor: "green" }}>
      <Author author={item.author} />
      <div>{item.displayMessage}</div>
    </div>
  );
}
