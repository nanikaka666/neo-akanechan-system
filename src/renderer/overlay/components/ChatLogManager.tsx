import { useEffect, useState } from "react";
import { ChatLog } from "../../../types/chatLog";

export function ChatLogManager() {
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);

  useEffect(() => {
    const remover = window.ipcApi.registerChatLogListener((_, chatLog) => {
      setChatLogs((prev) => [...prev, chatLog].slice(-20));
    });
    return () => remover();
  }, []);

  return (
    <div className="chat-log">
      <div className="chat-log-container">
        {chatLogs.map((chatLog) => {
          return (
            <div className="chat-log-item" key={chatLog.data.id.id}>
              <div>
                <img src={chatLog.data.author.profileImageUrl} />
                <span>{chatLog.data.author.name}</span>
                {chatLog.votedTo && <span>{chatLog.votedTo}</span>}
              </div>
              <div>{chatLog.data.displayMessage}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
