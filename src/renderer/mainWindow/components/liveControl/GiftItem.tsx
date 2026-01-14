import { MembershipGift } from "../../../../ipcEvent";
import { Author } from "./Author";

export function GiftItem({ item }: { item: MembershipGift }) {
  return (
    <div style={{ backgroundColor: "pink" }}>
      <Author author={item.author} />
      {item.displayMessage}
      Gift Num: {item.giftCount}
    </div>
  );
}
