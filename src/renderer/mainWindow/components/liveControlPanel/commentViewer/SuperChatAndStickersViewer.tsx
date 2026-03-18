import { Virtuoso } from "react-virtuoso";
import { ExtendedSuperItem } from "../../../../../types/liveChatItem";
import { SuperChatItem } from "./SuperChatItem";
import { SuperStickerItem } from "./SuperStickerItem";
import { useListRange } from "../../hooks/useListRange";
import { ListRangeView } from "./ListRangeView";
import { useJumpToLatestButton } from "../../hooks/useJumpToLatestButton";
import { JumpToLatestButton } from "./JumpToLatestButton";

interface SuperChatAndStickersProps {
  superChatAndStickers: ExtendedSuperItem[];
}

export function SuperChatAndStickersViewer({ superChatAndStickers }: SuperChatAndStickersProps) {
  const [range, rangeUpdator] = useListRange();
  const [ref, isShownJumpButton, onAtBottomStateChanged] = useJumpToLatestButton();

  return (
    <div>
      <div style={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}>
        <ListRangeView range={range} chunkSize={superChatAndStickers.length} />
        {isShownJumpButton && (
          <JumpToLatestButton ref={ref} lastIndex={superChatAndStickers.length - 1} />
        )}
      </div>
      <Virtuoso
        ref={ref}
        data={superChatAndStickers}
        atBottomThreshold={200}
        atBottomStateChange={onAtBottomStateChanged}
        style={{ height: `calc(100vh - 50px)` }}
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
    </div>
  );
}
