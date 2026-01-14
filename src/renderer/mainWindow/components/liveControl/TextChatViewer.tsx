import { useState, useRef } from "react";
import { ListRange, VirtuosoHandle, Virtuoso } from "react-virtuoso";
import { ExtendedChatItemText } from "../../../../ipcEvent";
import { RangeInfo } from "./CommentViewer";
import { TextChatItem } from "./TextChatItem";

export function TextChatViewer({
  textChats,
  textChatNum,
}: {
  textChats: ExtendedChatItemText[];
  textChatNum: number;
}) {
  const [range, setRange] = useState<ListRange>({ startIndex: 0, endIndex: 0 });
  const ref = useRef<VirtuosoHandle>(null); // for control scroll position
  const [showGoToBottom, setShowGoToBottom] = useState(false);

  const rangeInfo: RangeInfo | undefined =
    textChats.length !== 0 &&
    range.startIndex < textChats.length &&
    range.endIndex < textChats.length
      ? {
          time: {
            start: textChats[range.startIndex].formattedTimeString,
            end: textChats[range.endIndex].formattedTimeString,
          },
          indexOfWhole: {
            start: textChats[range.startIndex].indexOfWhole,
            end: textChats[range.endIndex].indexOfWhole,
          },
        }
      : undefined;

  return (
    <div>
      <div style={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}>
        <p>
          Range: {range.startIndex} - {range.endIndex} / {textChats.length}
        </p>
        {rangeInfo && (
          <p>
            {`${rangeInfo.time.start} (${rangeInfo.indexOfWhole.start}) - ${rangeInfo.time.end} (${rangeInfo.indexOfWhole.end}) / ${textChatNum}`}
          </p>
        )}
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
          // console.log(`Bottom status changed. ${atBottom}`);
          setShowGoToBottom((_) => !atBottom);
        }}
        style={{ height: `calc(100vh - 50px)` }}
        followOutput={(isAtBottom) => {
          // console.log(`FollowOutput isAtBottom: ${isAtBottom}`);
          return isAtBottom ? "smooth" : false;
        }}
        rangeChanged={(newRange) => {
          setRange((_) => newRange);
        }}
        itemContent={(index, textChat) => {
          return <TextChatItem item={textChat} key={textChat.id.id} />;
        }}
      />
    </div>
  );
}
