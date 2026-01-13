import { ExtendedGiftRedemption } from "../../../../ipcEvent";
import { Author } from "./Author";

export function RedemptionItem({ item }: { item: ExtendedGiftRedemption }) {
  return (
    <div style={{ backgroundColor: "purple" }}>
      <Author author={item.author} />
      <div>{item.displayMessage}</div>
    </div>
  );
}
