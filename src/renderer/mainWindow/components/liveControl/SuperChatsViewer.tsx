import { useState, useRef, useEffect } from "react";
import { ListRange, VirtuosoHandle, Virtuoso } from "react-virtuoso";
import { ExtendedSuperItem } from "../../../../ipcEvent";
import { RangeInfo } from "./CommentViewer";
import { SuperChatItem } from "./SuperChatItem";
import { SuperStickerItem } from "./SuperStickerItem";

export function SuperChatsViewer({
  superChats,
  superChatsNum,
}: {
  superChats: ExtendedSuperItem[];
  superChatsNum: number;
}) {
  const [range, setRange] = useState<ListRange>({ startIndex: 0, endIndex: 0 });
  const ref = useRef<VirtuosoHandle>(null); // for control scroll position
  const [rangeInfo, setRangeInfo] = useState<RangeInfo>();
  const [showGoToBottom, setShowGoToBottom] = useState(false);

  useEffect(() => {
    if (superChats.length !== 0) {
      setRangeInfo((_) => {
        return {
          time: {
            start: superChats[range.startIndex].formatedTime,
            end: superChats[range.endIndex].formatedTime,
          },
          indexOfWhole: {
            start: range.startIndex + 1,
            end: range.endIndex + 1,
          },
        };
      });
    }
  }, [superChats, range]);

  return (
    <div>
      <div style={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}>
        <p>
          Range: {range.startIndex} - {range.endIndex} / {superChats.length}
        </p>
        {rangeInfo && (
          <p>
            {`${rangeInfo.time.start} (${rangeInfo.indexOfWhole.start}) - ${rangeInfo.time.end} (${rangeInfo.indexOfWhole.end}) / ${superChatsNum}`}
          </p>
        )}
        {showGoToBottom && (
          <button
            onClick={(e) => {
              e.preventDefault();
              ref.current?.scrollIntoView({
                index: superChats.length - 1,
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
        data={superChats}
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
        itemContent={(index, superChatsItem) => {
          return superChatsItem.type === "superChat" ? (
            <SuperChatItem item={superChatsItem} key={superChatsItem.id.id} />
          ) : (
            <SuperStickerItem item={superChatsItem} key={superChatsItem.id.id} />
          );
        }}
      />
    </div>
  );
}
