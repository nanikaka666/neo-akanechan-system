import { FocusedOnChatItem } from "../../../../types/liveChatItem";
import { UnfocusButton } from "./UnfocusButton";
import { FocusButton } from "./FocusButton";

export function FocusForm({ item }: { item: FocusedOnChatItem }) {
  return item.isFocused ? <UnfocusButton /> : <FocusButton item={item} />;
}
