import { type Author } from "youtube-livechat-emitter/dist/src/types/liveChat";

export function Author({ author }: { author: Author }) {
  return (
    <div>
      <img src={author.thumbnails[0].url} style={{ width: "14px" }} />
      <span
        style={{
          marginLeft: "5px",
          marginRight: "5px",
          fontWeight: "bold",
          color: author.memberships ? "red" : "black",
        }}
      >
        {author.name}
      </span>
      <span>
        {author.memberships && (
          <>
            <img src={author.memberships.thumbnails[0].url} style={{ width: "16px" }}></img>
            <span>{author.memberships.label}</span>
          </>
        )}
      </span>
    </div>
  );
}
