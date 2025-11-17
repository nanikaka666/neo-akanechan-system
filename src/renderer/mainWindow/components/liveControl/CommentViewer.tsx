import { useEffect, useRef, useState } from "react";
import { ListRange, Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { ChatItemText } from "youtube-livechat-emitter/dist/src/types/liveChat";

interface TimeRange {
  start: string;
  end: string;
}

export function CommentViewer() {
  const [textChats, setTextChats] = useState<ChatItemText[]>([]);
  const [range, setRange] = useState<ListRange>({ startIndex: 0, endIndex: 0 });
  const ref = useRef<VirtuosoHandle>(null); // for control scroll position
  const [timeRange, setTimeRange] = useState<TimeRange>();
  const [showGoToBottom, setShowGoToBottom] = useState(false);

  useEffect(() => {
    window.ipcApi.registerTextChatsListener((e, newTextChats) => {
      console.log("Set New TextChats: ", newTextChats.length);
      setTextChats((_) => newTextChats);
    });
  }, []);

  return (
    <div>
      <div style={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}>
        <p>
          {range.startIndex} - {range.endIndex} / {textChats.length}
        </p>
        {timeRange && (
          <p>
            {timeRange.start} - {timeRange.end}
          </p>
        )}
        {showGoToBottom && (
          <button
            onClick={(e) => {
              e.preventDefault();
              console.log("come here");
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
        style={{ height: `calc(100vh)` }}
        followOutput={(isAtBottom) => {
          console.log(`FollowOutput isAtBottom: ${isAtBottom}`);
          return isAtBottom ? "smooth" : false;
        }}
        rangeChanged={(newRange) => {
          setRange((_) => newRange);
          setTimeRange((_) => {
            const startDate = new Date(textChats[newRange.startIndex].timestamp / 1000); // microsecond to millisecond
            const endDate = new Date(textChats[newRange.endIndex].timestamp / 1000);
            return {
              start: `${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}`,
              end: `${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}`,
            };
          });
        }}
        itemContent={(index, textChat) => {
          return (
            <div style={{}}>
              <div>
                <img src={textChat.author.thumbnails[0].url} />
                {textChat.author.name}
              </div>

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
