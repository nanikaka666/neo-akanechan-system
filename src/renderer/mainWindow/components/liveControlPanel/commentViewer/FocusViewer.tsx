import { FocusedOnChatItem } from "../../../../../types/liveChatItem";
import { FocusItem } from "./FocusItem";

interface FocusViewerProps {
  focus?: FocusedOnChatItem;
}

export function FocusViewer({ focus }: FocusViewerProps) {
  return (
    <div className="virtuoso">
      {focus ? <FocusItem item={focus} /> : <div>フォーカス中のアイテムはありません</div>}
    </div>
  );
}
