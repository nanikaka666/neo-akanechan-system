import { FocusedOnChatItem } from "../../../../../types/liveChatItem";
import { UnfocusButton } from "./UnfocusButton";
import { FocusButton } from "./FocusButton";

interface FocusFormProps {
  item: FocusedOnChatItem;
}

export function FocusForm({ item }: FocusFormProps) {
  return item.isFocused ? <UnfocusButton /> : <FocusButton item={item} />;
}
