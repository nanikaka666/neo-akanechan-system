import { useState, useRef, useEffect } from "react";
import { ListRange, VirtuosoHandle, Virtuoso } from "react-virtuoso";
import { ExtendedChatItemText } from "../../../../ipcEvent";
import { RangeInfo } from "./CommentViewer";

export function TextChatViewer({
  textChats,
  textChatNum,
}: {
  textChats: ExtendedChatItemText[];
  textChatNum: number;
}) {
  const [range, setRange] = useState<ListRange>({ startIndex: 0, endIndex: 0 });
  const ref = useRef<VirtuosoHandle>(null); // for control scroll position
  const [rangeInfo, setRangeInfo] = useState<RangeInfo>();
  const [showGoToBottom, setShowGoToBottom] = useState(false);

  useEffect(() => {
    if (textChats.length !== 0) {
      setRangeInfo((_) => {
        return {
          time: {
            start: textChats[range.startIndex].formatedTime,
            end: textChats[range.endIndex].formatedTime,
          },
          indexOfWhole: {
            start: textChats[range.startIndex].indexOfWhole,
            end: textChats[range.endIndex].indexOfWhole,
          },
        };
      });
    }
  }, [textChats, range]);

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
          console.log(`Bottom status changed. ${atBottom}`);
          setShowGoToBottom((_) => !atBottom);
        }}
        style={{ height: `calc(100vh - 50px)` }}
        followOutput={(isAtBottom) => {
          console.log(`FollowOutput isAtBottom: ${isAtBottom}`);
          return isAtBottom ? "smooth" : false;
        }}
        rangeChanged={(newRange) => {
          setRange((_) => newRange);
        }}
        itemContent={(index, textChat) => {
          return (
            <div style={textChat.isFirst ? { backgroundColor: "yellowgreen" } : {}}>
              <img src={textChat.author.thumbnails[0].url} />
              <span style={{ marginLeft: "5px", marginRight: "5px", fontWeight: "bold" }}>
                {textChat.author.name}
                {textChat.author.memberships && (
                  <>
                    <img
                      src={textChat.author.memberships.thumbnails[0].url}
                      style={{ width: "16px" }}
                    ></img>
                    <span>{textChat.author.memberships.label}</span>
                  </>
                )}
              </span>

              {textChat.messages.map((messageItem, idx) => {
                return messageItem.type === "text" ? (
                  messageItem.text
                ) : (
                  <img style={{ width: "16px" }} src={messageItem.images[0].url} key={idx} />
                );
              })}
            </div>
          );
        }}
      />
    </div>
  );
}
