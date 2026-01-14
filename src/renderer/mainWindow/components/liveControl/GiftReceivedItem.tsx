import { GiftReceived } from "../../../../types/liveChatItem";
import { Author } from "./Author";

export function GiftReceivedItem({ item }: { item: GiftReceived }) {
  return (
    <div style={{ backgroundColor: "purple" }}>
      <Author author={item.author} />
      <div>{item.displayMessage}</div>
    </div>
  );
}
