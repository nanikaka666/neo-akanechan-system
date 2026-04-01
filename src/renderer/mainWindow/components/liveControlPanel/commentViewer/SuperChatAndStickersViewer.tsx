import { Virtuoso } from "react-virtuoso";
import { ExtendedSuperItem } from "../../../../../types/liveChatItem";
import { SuperChatItem } from "./SuperChatItem";
import { SuperStickerItem } from "./SuperStickerItem";
import { useListRange } from "../../../hooks/useListRange";
import { useJumpToLatestButton } from "../../../hooks/useJumpToLatestButton";
import { JumpToLatestButton } from "./JumpToLatestButton";

interface SuperChatAndStickersViewerProps {
  superChatAndStickers: ExtendedSuperItem[];
}

export function SuperChatAndStickersViewer({
  superChatAndStickers,
}: SuperChatAndStickersViewerProps) {
  const [_, rangeUpdator] = useListRange();
  const [ref, isShownJumpButton, onAtBottomStateChanged] = useJumpToLatestButton();

  return (
    <div>
      <Virtuoso
        className="virtuoso"
        style={{ height: "95vh" }}
        ref={ref}
        data={superChatAndStickers}
        atBottomThreshold={50}
        atBottomStateChange={onAtBottomStateChanged}
        followOutput={(isAtBottom) => {
          return isAtBottom ? "smooth" : false;
        }}
        rangeChanged={rangeUpdator}
        itemContent={(index, item) => {
          return item.type === "superChat" ? (
            <SuperChatItem item={item} key={item.id.id} />
          ) : (
            <SuperStickerItem item={item} key={item.id.id} />
          );
        }}
      />
      {isShownJumpButton && (
        <JumpToLatestButton ref={ref} lastIndex={superChatAndStickers.length - 1} />
      )}
    </div>
  );
}
