import { MessageItem } from "youtube-livechat-emitter/dist/src/types/liveChat";

export function Messages({ messages }: { messages: MessageItem[] }) {
  return (
    <div>
      {messages.map((item, idx) => {
        return item.type === "text" ? (
          item.text
        ) : (
          <img style={{ width: "16px" }} src={item.images[0].url} key={idx} />
        );
      })}
    </div>
  );
}
