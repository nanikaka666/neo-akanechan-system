import { ExtendedMembershipMilestone } from "../../../../ipcEvent";
import { Author } from "./Author";
import { Messages } from "./Messages";

export function MilestoneMembershipsItem({ item }: { item: ExtendedMembershipMilestone }) {
  return (
    <div style={{ backgroundColor: "skyblue" }}>
      <Author author={item.author} />
      <Messages messages={item.milestone} />
      {item.messages && <Messages messages={item.messages} />}
    </div>
  );
}
