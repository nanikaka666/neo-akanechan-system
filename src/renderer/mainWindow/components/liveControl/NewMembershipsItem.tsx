import { ExtendedNewMembership } from "../../../../ipcEvent";
import { Author } from "./Author";
import { Messages } from "./Messages";

export function NewMembershipsItem({ item }: { item: ExtendedNewMembership }) {
  return (
    <div style={{ backgroundColor: "green" }}>
      <Author author={item.author} />
      <Messages messages={item.messages} />
    </div>
  );
}
