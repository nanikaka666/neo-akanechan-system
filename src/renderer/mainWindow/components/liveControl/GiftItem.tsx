import { ExtendedSponsorshipsGift } from "../../../../ipcEvent";
import { Author } from "./Author";

export function GiftItem({ item }: { item: ExtendedSponsorshipsGift }) {
  return (
    <div style={{ backgroundColor: "pink" }}>
      <Author author={item.author} />
      {item.displayMessage}
      Gift Num: {item.giftCount}
    </div>
  );
}
