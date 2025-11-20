import { useEffect, useState } from "react";
import { ExtendedChatItemText } from "../../../../ipcEvent";
import { Author } from "./Author";
import { Messages } from "./Messages";

export function TextChatItem({ item }: { item: ExtendedChatItemText }) {
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setIsSending((_) => false);
  }, [item.isStocked]);

  return (
    <div style={item.isFirst ? { backgroundColor: "yellowgreen" } : {}}>
      <Author author={item.author} />
      <Messages messages={item.messages} />
      {item.isStocked ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsSending((_) => true);
            window.ipcApi.requestRemoveStock(item);
          }}
          disabled={isSending}
        >
          ストックから外す
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsSending((_) => true);
            window.ipcApi.requestAddStock(item);
          }}
          disabled={isSending}
        >
          ストックする
        </button>
      )}
    </div>
  );
}
