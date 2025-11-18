import { ExtendedChatItemSuperChat } from "../../../../ipcEvent";

export function SuperChatItem({ item }: { item: ExtendedChatItemSuperChat }) {
  return (
    <div style={{ backgroundColor: `#${item.superChat.color.hex}` }}>
      <img src={item.author.thumbnails[0].url} />
      <span style={{ marginLeft: "5px", marginRight: "5px", fontWeight: "bold" }}>
        {item.author.name}
        {item.author.memberships && (
          <>
            <img src={item.author.memberships.thumbnails[0].url} style={{ width: "16px" }}></img>
            <span>{item.author.memberships.label}</span>
          </>
        )}
      </span>

      <span style={{ fontWeight: "bold", fontSize: "24px" }}>{item.superChat.amount}</span>

      {item.messages &&
        item.messages.map((messageItem, idx) => {
          return messageItem.type === "text" ? (
            messageItem.text
          ) : (
            <img style={{ width: "16px" }} src={messageItem.images[0].url} key={idx} />
          );
        })}
    </div>
  );
}
