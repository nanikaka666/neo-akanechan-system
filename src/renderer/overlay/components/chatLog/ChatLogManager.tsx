import { useEffect, useState } from "react";
import { ChatLog } from "../../../../types/chatLog";
import { ChatLogItem } from "./ChatLogItem";

export function ChatLogManager() {
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);

  useEffect(() => {
    const remover = window.ipcApi.registerChatLogListener((_, chatLog) => {
      setChatLogs((prev) => [...prev, chatLog].slice(-20));
    });
    return () => remover();
  }, []);

  return (
    <div className="chat-log-container">
      <div className="chat-log">
        {chatLogs.map((item) => (
          <ChatLogItem key={item.data.id.id} item={item} />
        ))}
      </div>
    </div>
  );
}
