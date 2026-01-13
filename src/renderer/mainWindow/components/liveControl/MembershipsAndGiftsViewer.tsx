import { useState, useRef } from "react";
import { ListRange, VirtuosoHandle, Virtuoso } from "react-virtuoso";
import { ExtendedMembershipAndGiftItem } from "../../../../ipcEvent";
import { RangeInfo } from "./CommentViewer";
import { NewMembershipsItem } from "./NewMembershipsItem";
import { MilestoneMembershipsItem } from "./MilestoneMembershipsItem";
import { GiftItem } from "./GiftItem";
import { RedemptionItem } from "./RedemptionItem";

export function MembershipsAndGiftsViewer({
  membershipsAndGifts,
}: {
  membershipsAndGifts: ExtendedMembershipAndGiftItem[];
}) {
  const [range, setRange] = useState<ListRange>({ startIndex: 0, endIndex: 0 });
  const ref = useRef<VirtuosoHandle>(null); // for control scroll position
  const [showGoToBottom, setShowGoToBottom] = useState(false);

  const rangeInfo: RangeInfo | undefined =
    membershipsAndGifts.length !== 0 &&
    range.startIndex < membershipsAndGifts.length &&
    range.endIndex < membershipsAndGifts.length
      ? {
          time: {
            start: membershipsAndGifts[range.startIndex].formatedTime,
            end: membershipsAndGifts[range.endIndex].formatedTime,
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
          Range: {range.startIndex} - {range.endIndex} / {membershipsAndGifts.length}
        </p>
        {rangeInfo && (
          <p>
            {`${rangeInfo.time.start} (${rangeInfo.indexOfWhole.start}) - ${rangeInfo.time.end} (${rangeInfo.indexOfWhole.end}) / ${membershipsAndGifts.length}`}
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
          return item.type === "newMembership" ? (
            <NewMembershipsItem item={item} key={item.id.id} />
          ) : item.type === "milestone" ? (
            <MilestoneMembershipsItem item={item} key={item.id.id} />
          ) : item.type === "gift" ? (
            <GiftItem item={item} key={item.id.id} />
          ) : (
            <RedemptionItem item={item} key={item.id.id} />
          );
        }}
      />
    </div>
  );
}
