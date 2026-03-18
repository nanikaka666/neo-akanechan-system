import { Virtuoso } from "react-virtuoso";
import { ExtendedChatItemText } from "../../../../../types/liveChatItem";
import { TextChatItem } from "./TextChatItem";
import { useListRange } from "../../hooks/useListRange";
import { ListRangeView } from "./ListRangeView";
import { useJumpToLatestButton } from "../../hooks/useJumpToLatestButton";
import { JumpToLatestButton } from "./JumpToLatestButton";

interface TextChatViewerProps {
  textChats: ExtendedChatItemText[];
}

export function TextChatViewer({ textChats }: TextChatViewerProps) {
  const [range, rangeUpdator] = useListRange();

  const [ref, isShownJumpButton, onAtBottomStateChanged] = useJumpToLatestButton();

  return (
    <div>
      <div style={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}>
        <ListRangeView range={range} chunkSize={textChats.length} />
        {isShownJumpButton && <JumpToLatestButton ref={ref} lastIndex={textChats.length - 1} />}
      </div>
      <Virtuoso
        ref={ref}
        data={textChats}
        atBottomThreshold={200}
        atBottomStateChange={onAtBottomStateChanged}
        style={{ height: `calc(100vh - 50px)` }}
        followOutput={(isAtBottom) => {
          return isAtBottom ? "smooth" : false;
        }}
        rangeChanged={rangeUpdator}
        itemContent={(index, textChat) => {
          return <TextChatItem item={textChat} key={textChat.id.id} />;
        }}
      />
    </div>
  );
}
