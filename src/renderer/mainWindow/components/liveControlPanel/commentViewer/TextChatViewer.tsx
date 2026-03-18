import { useState, useRef } from "react";
import { VirtuosoHandle, Virtuoso } from "react-virtuoso";
import { ExtendedChatItemText } from "../../../../../types/liveChatItem";
import { TextChatItem } from "./TextChatItem";
import { useListRange } from "../../hooks/useListRange";
import { ListRangeView } from "./ListRangeView";

export function TextChatViewer({
  textChats,
  textChatNum,
}: {
  textChats: ExtendedChatItemText[];
  textChatNum: number;
}) {
  const [range, rangeUpdator] = useListRange();
  const ref = useRef<VirtuosoHandle>(null); // for control scroll position
  const [showGoToBottom, setShowGoToBottom] = useState(false);

  return (
    <div>
      <div style={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}>
        <ListRangeView range={range} chunkSize={textChats.length} />
        {showGoToBottom && (
          <button
            onClick={(e) => {
              e.preventDefault();
              ref.current?.scrollIntoView({
                index: textChats.length - 1,
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
        data={textChats}
        atBottomThreshold={200}
        atBottomStateChange={(atBottom) => {
          setShowGoToBottom((_) => !atBottom);
        }}
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
