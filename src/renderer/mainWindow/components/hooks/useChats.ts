import { useEffect, useState } from "react";
import {
  ExtendedChatItemText,
  ExtendedSuperItem,
  FocusedOnChatItem,
} from "../../../../types/liveChatItem";

export function useChats() {
  const [textChats, setTextChats] = useState<ExtendedChatItemText[]>([]);
  const [textChatNum, setTextChatNum] = useState(0);

  const [superChatAndStickers, setSuperChatAndStickers] = useState<ExtendedSuperItem[]>([]);

  const [stocks, setStocks] = useState<ExtendedChatItemText[]>([]);

  const [focus, setFocus] = useState<FocusedOnChatItem>();

  useEffect(() => {
    const remover = window.ipcApi.registerChatsListener((e, chats) => {
      setTextChats((_) => chats.textChats.items);
      setTextChatNum((_) => chats.textChats.num);
      setSuperChatAndStickers((_) => chats.superChatAndStickers);
      setStocks((_) => chats.stocks);
      setFocus((_) => chats.focus);
    });
    return () => remover();
  }, []);

  return [textChats, textChatNum, superChatAndStickers, stocks, focus] as const;
}
