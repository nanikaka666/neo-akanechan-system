import { ExtendedGiftRedemption } from "../../../../ipcEvent";
import { Author } from "./Author";
import { Messages } from "./Messages";

export function RedemptionItem({ item }: { item: ExtendedGiftRedemption }) {
  return (
    <div style={{ backgroundColor: "purple" }}>
      <Author author={item.author} />
      <Messages messages={item.messages} />
    </div>
  );
}
