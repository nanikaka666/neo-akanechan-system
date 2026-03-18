import { useState, useRef } from "react";
import { VirtuosoHandle, Virtuoso } from "react-virtuoso";
import { ExtendedSuperItem } from "../../../../../types/liveChatItem";
import { SuperChatItem } from "./SuperChatItem";
import { SuperStickerItem } from "./SuperStickerItem";
import { useListRange } from "../../hooks/useListRange";
import { ListRangeView } from "./ListRangeView";

export function SuperChatAndStickersViewer({
  superChatAndStickers,
}: {
  superChatAndStickers: ExtendedSuperItem[];
}) {
  const [range, rangeUpdator] = useListRange();
  const ref = useRef<VirtuosoHandle>(null); // for control scroll position
  const [showGoToBottom, setShowGoToBottom] = useState(false);

  return (
    <div>
      <div style={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}>
        <ListRangeView range={range} chunkSize={superChatAndStickers.length} />
        {showGoToBottom && (
          <button
            onClick={(e) => {
              e.preventDefault();
              ref.current?.scrollIntoView({
                index: superChatAndStickers.length - 1,
                align: "end",
                behavior: "auto",
              });
            }}
          >
            Go to end
          </button>
        )}
      </div>
      <Virtuoso
        ref={ref}
        data={superChatAndStickers}
        atBottomThreshold={200}
        atBottomStateChange={(atBottom) => {
          setShowGoToBottom((_) => !atBottom);
        }}
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
