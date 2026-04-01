import { Virtuoso } from "react-virtuoso";
import { MembershipAndGiftItem } from "../../../../../types/liveChatItem";
import { NewMembershipItem } from "./NewMembershipItem";
import { MembershipMilestoneItem } from "./MembershipMilestoneItem";
import { MembershipGiftItem } from "./MembershipGiftItem";
import { GiftReceivedItem } from "./GiftReceivedItem";
import { useListRange } from "../../../hooks/useListRange";
import { useJumpToLatestButton } from "../../../hooks/useJumpToLatestButton";
import { JumpToLatestButton } from "./JumpToLatestButton";

interface MembershipsAndGiftsViewerProps {
  membershipsAndGifts: MembershipAndGiftItem[];
}

export function MembershipsAndGiftsViewer({ membershipsAndGifts }: MembershipsAndGiftsViewerProps) {
  const [_, rangeUpdator] = useListRange();
  const [ref, isShownJumpButton, onAtBottomStateChanged] = useJumpToLatestButton();

  return (
    <div>
      <Virtuoso
        className="virtuoso"
        style={{ height: "95vh" }}
        ref={ref}
        data={membershipsAndGifts}
        atBottomThreshold={50}
        atBottomStateChange={onAtBottomStateChanged}
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
      {isShownJumpButton && (
        <JumpToLatestButton ref={ref} lastIndex={membershipsAndGifts.length - 1} />
      )}
    </div>
  );
}
