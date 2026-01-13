import { ChatAuthor } from "../../../../ipcEvent";

export function Author({ author }: { author: ChatAuthor }) {
  return (
    <div>
      <img src={author.profileImageUrl} style={{ width: "14px" }} />
      <span
        style={{
          marginLeft: "5px",
          marginRight: "5px",
          fontWeight: "bold",
          color: author.isMembership ? "red" : "black",
        }}
      >
        {author.name}
      </span>
    </div>
  );
}
