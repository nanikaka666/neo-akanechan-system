import { useState, useRef } from "react";
import { VirtuosoHandle, Virtuoso } from "react-virtuoso";
import { MembershipAndGiftItem } from "../../../../../types/liveChatItem";
import { NewMembershipItem } from "./NewMembershipItem";
import { MembershipMilestoneItem } from "./MembershipMilestoneItem";
import { MembershipGiftItem } from "./MembershipGiftItem";
import { GiftReceivedItem } from "./GiftReceivedItem";
import { useListRange } from "../../hooks/useListRange";
import { ListRangeView } from "./ListRangeView";

export function MembershipsAndGiftsViewer({
  membershipsAndGifts,
}: {
  membershipsAndGifts: MembershipAndGiftItem[];
}) {
  const [range, rangeUpdator] = useListRange();
  const ref = useRef<VirtuosoHandle>(null); // for control scroll position
  const [showGoToBottom, setShowGoToBottom] = useState(false);

  return (
    <div>
      <div style={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}>
        <ListRangeView range={range} chunkSize={membershipsAndGifts.length} />
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
        rangeChanged={rangeUpdator}
        itemContent={(index, item) => {
          return item.type === "newMembership" ? (
            <NewMembershipItem item={item} key={item.id.id} />
          ) : item.type === "milestone" ? (
            <MembershipMilestoneItem item={item} key={item.id.id} />
          ) : item.type === "gift" ? (
            <MembershipGiftItem item={item} key={item.id.id} />
          ) : (
            <GiftReceivedItem item={item} key={item.id.id} />
          );
        }}
      />
    </div>
  );
}
