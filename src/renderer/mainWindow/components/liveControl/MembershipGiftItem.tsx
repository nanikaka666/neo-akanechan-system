import { MembershipGift } from "../../../../ipcEvent";
import { Author } from "./Author";

export function MembershipGiftItem({ item }: { item: MembershipGift }) {
  return (
    <div style={{ backgroundColor: "pink" }}>
      <Author author={item.author} />
      <p>{item.displayMessage}</p>
      <p>Gift Num: {item.giftCount}</p>
    </div>
  );
}
