import { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { ChatItemText } from "youtube-livechat-emitter/dist/src/types/liveChat";

export function CommentViewer() {
  const [textChats, setTextChats] = useState<ChatItemText[]>([]);

  useEffect(() => {
    window.ipcApi.registerTextChatsListener((e, newTextChats) => {
      console.log("Set New TextChats");
      setTextChats((_) => newTextChats);
    });
  }, []);

  return (
    <div>
      <Virtuoso
        data={textChats}
        style={{ height: `calc(100vh)` }}
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
