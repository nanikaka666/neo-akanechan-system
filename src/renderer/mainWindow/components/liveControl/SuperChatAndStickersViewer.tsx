import { useState, useRef } from "react";
import { ListRange, VirtuosoHandle, Virtuoso } from "react-virtuoso";
import { ExtendedSuperItem } from "../../../../ipcEvent";
import { RangeInfo } from "./CommentViewer";
import { SuperChatItem } from "./SuperChatItem";
import { SuperStickerItem } from "./SuperStickerItem";

export function SuperChatAndStickersViewer({
  superChatAndStickers,
}: {
  superChatAndStickers: ExtendedSuperItem[];
}) {
  const [range, setRange] = useState<ListRange>({ startIndex: 0, endIndex: 0 });
  const ref = useRef<VirtuosoHandle>(null); // for control scroll position
  const [showGoToBottom, setShowGoToBottom] = useState(false);

  const rangeInfo: RangeInfo | undefined =
    superChatAndStickers.length !== 0 &&
    range.startIndex < superChatAndStickers.length &&
    range.endIndex < superChatAndStickers.length
      ? {
          time: {
            start: superChatAndStickers[range.startIndex].formatedTime,
            end: superChatAndStickers[range.endIndex].formatedTime,
          },
          indexOfWhole: {
            start: range.startIndex + 1,
            end: range.endIndex + 1,
          },
        }
      : undefined;

  return (
    <div>
      <div style={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}>
        <p>
          Range: {range.startIndex} - {range.endIndex} / {superChatAndStickers.length}
        </p>
        {rangeInfo && (
          <p>
            {`${rangeInfo.time.start} (${rangeInfo.indexOfWhole.start}) - ${rangeInfo.time.end} (${rangeInfo.indexOfWhole.end}) / ${superChatAndStickers.length}`}
          </p>
        )}
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
        rangeChanged={(newRange) => {
          setRange((_) => newRange);
        }}
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
