import { ExtendedMembershipMilestone } from "../../../../ipcEvent";
import { Author } from "./Author";

export function MilestoneMembershipsItem({ item }: { item: ExtendedMembershipMilestone }) {
  return (
    <div style={{ backgroundColor: "skyblue" }}>
      <Author author={item.author} />
      <div>{item.displayMessage}</div>
      <div>{item.userComment}</div>
    </div>
  );
}
