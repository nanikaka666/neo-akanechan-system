import { FocusedOnChatItem } from "../../../../types/ipcEvent";
import { FocusItem } from "./FocusItem";

export function FocusViewer({ focus }: { focus?: FocusedOnChatItem }) {
  return (
    <div style={{ height: `calc(100vh - 50px)` }}>
      {focus ? <FocusItem item={focus} /> : <div>フォーカス中のアイテムはありません</div>}
    </div>
  );
}
