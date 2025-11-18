import { ExtendedSponsorshipsGift } from "../../../../ipcEvent";
import { Author } from "./Author";
import { Messages } from "./Messages";

export function GiftItem({ item }: { item: ExtendedSponsorshipsGift }) {
  return (
    <div style={{ backgroundColor: "pink" }}>
      <Author author={item.author} />
      {item.messages && <Messages messages={item.messages} />}
      Gift Num: {item.num}
    </div>
  );
}
