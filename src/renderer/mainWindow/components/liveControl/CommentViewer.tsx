import { useEffect, useMemo, useState } from "react";
import { ListRange, Virtuoso } from "react-virtuoso";
import { ChatItemText } from "youtube-livechat-emitter/dist/src/types/liveChat";

export function CommentViewer() {
  const [textChats, setTextChats] = useState<ChatItemText[]>([]);
  const [range, setRange] = useState<ListRange>({ startIndex: 0, endIndex: 0 });
  const atTheEnd = useMemo(() => {
    return textChats.length === 0 || textChats.length - 1 === range.endIndex;
  }, [textChats, range]);

  useEffect(() => {
    window.ipcApi.registerTextChatsListener((e, newTextChats) => {
      console.log("Set New TextChats");
      setTextChats((_) => newTextChats);
    });
  }, []);

  return (
    <div>
      <div style={{ position: "absolute", top: 0, right: 0 }}>
        {range.startIndex} - {range.endIndex} / {textChats.length}
        At the End: {atTheEnd ? "YES" : "NO"}
      </div>
      <Virtuoso
        data={textChats}
        style={{ height: `calc(100vh)` }}
        rangeChanged={setRange}
        itemContent={(index, textChat) => {
          return (
            <div>
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
