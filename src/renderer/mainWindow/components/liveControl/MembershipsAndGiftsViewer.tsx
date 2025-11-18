import { useState, useRef, useEffect } from "react";
import { ListRange, VirtuosoHandle, Virtuoso } from "react-virtuoso";
import { ExtendedMembershipAndGiftItem } from "../../../../ipcEvent";
import { RangeInfo } from "./CommentViewer";
import { NewMembershipsItem } from "./NewMembershipsItem";
import { MilestoneMembershipsItem } from "./MilestoneMembershipsItem";
import { GiftItem } from "./GiftItem";

export function MembershipsAndGiftsViewer({
  membershipsAndGifts,
  membershipsAndGiftsNum,
}: {
  membershipsAndGifts: ExtendedMembershipAndGiftItem[];
  membershipsAndGiftsNum: number;
}) {
  const [range, setRange] = useState<ListRange>({ startIndex: 0, endIndex: 0 });
  const ref = useRef<VirtuosoHandle>(null); // for control scroll position
  const [rangeInfo, setRangeInfo] = useState<RangeInfo>();
  const [showGoToBottom, setShowGoToBottom] = useState(false);

  useEffect(() => {
    if (membershipsAndGifts.length !== 0) {
      setRangeInfo((_) => {
        return {
          time: {
            start: membershipsAndGifts[range.startIndex].formatedTime,
            end: membershipsAndGifts[range.endIndex].formatedTime,
          },
          indexOfWhole: {
            start: range.startIndex + 1,
            end: range.endIndex + 1,
          },
        };
      });
    }
  }, [membershipsAndGifts, range]);

  return (
    <div>
      <div style={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}>
        <p>
          Range: {range.startIndex} - {range.endIndex} / {membershipsAndGifts.length}
        </p>
        {rangeInfo && (
          <p>
            {`${rangeInfo.time.start} (${rangeInfo.indexOfWhole.start}) - ${rangeInfo.time.end} (${rangeInfo.indexOfWhole.end}) / ${membershipsAndGiftsNum}`}
          </p>
        )}
        {showGoToBottom && (
          <button
            onClick={(e) => {
              e.preventDefault();
              ref.current?.scrollIntoView({
                index: membershipsAndGifts.length - 1,
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
        data={membershipsAndGifts}
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
          return item.type === "new" ? (
            <NewMembershipsItem item={item} />
          ) : item.type === "milestone" ? (
            <MilestoneMembershipsItem item={item} />
          ) : (
            <GiftItem item={item} />
          );
        }}
      />
    </div>
  );
}
