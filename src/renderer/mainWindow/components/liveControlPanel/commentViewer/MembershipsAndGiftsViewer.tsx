import { Virtuoso } from "react-virtuoso";
import { MembershipAndGiftItem } from "../../../../../types/liveChatItem";
import { NewMembershipItem } from "./NewMembershipItem";
import { MembershipMilestoneItem } from "./MembershipMilestoneItem";
import { MembershipGiftItem } from "./MembershipGiftItem";
import { GiftReceivedItem } from "./GiftReceivedItem";
import { useListRange } from "../../hooks/useListRange";
import { ListRangeView } from "./ListRangeView";
import { useJumpToLatestButton } from "../../hooks/useJumpToLatestButton";
import { JumpToLatestButton } from "./JumpToLatestButton";

interface MembershipsAndGiftsProps {
  membershipsAndGifts: MembershipAndGiftItem[];
}

export function MembershipsAndGiftsViewer({ membershipsAndGifts }: MembershipsAndGiftsProps) {
  const [range, rangeUpdator] = useListRange();
  const [ref, isShownJumpButton, onAtBottomStateChanged] = useJumpToLatestButton();

  return (
    <div>
      <div style={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}>
        <ListRangeView range={range} chunkSize={membershipsAndGifts.length} />
        {isShownJumpButton && (
          <JumpToLatestButton ref={ref} lastIndex={membershipsAndGifts.length - 1} />
        )}
      </div>
      <Virtuoso
        ref={ref}
        data={membershipsAndGifts}
        atBottomThreshold={200}
        atBottomStateChange={onAtBottomStateChanged}
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
