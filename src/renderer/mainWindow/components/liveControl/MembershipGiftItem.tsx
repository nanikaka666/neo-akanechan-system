import { MembershipGift } from "../../../../ipcEvent";
import { Author } from "./Author";

export function MembershipGiftItem({ item }: { item: MembershipGift }) {
  return (
    <div style={{ backgroundColor: "pink" }}>
      <Author author={item.author} />
      <div>{item.displayMessage}</div>
      <div>Gift Num: {item.giftCount}</div>
    </div>
  );
}
