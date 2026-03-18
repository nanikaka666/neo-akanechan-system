import { ExtendedChatItemText } from "../../../../../types/liveChatItem";
import { UnstockButton } from "./UnstockButton";
import { StockButton } from "./StockButton";

interface StockFormProps {
  item: ExtendedChatItemText;
}

export function StockForm({ item }: StockFormProps) {
  return item.isStocked ? <UnstockButton item={item} /> : <StockButton item={item} />;
}
