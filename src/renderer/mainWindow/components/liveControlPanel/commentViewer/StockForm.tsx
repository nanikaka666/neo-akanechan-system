import { ExtendedChatItemText } from "../../../../../types/liveChatItem";
import { UnstockButton } from "./UnstockButton";
import { StockButton } from "./StockButton";

export function StockForm({ item }: { item: ExtendedChatItemText }) {
  return item.isStocked ? <UnstockButton item={item} /> : <StockButton item={item} />;
}
