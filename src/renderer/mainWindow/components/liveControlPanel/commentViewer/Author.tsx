import { ChatAuthor } from "../../../../../types/liveChatItem";

interface AuthorProps {
  author: ChatAuthor;
}

export function Author({ author }: AuthorProps) {
  return (
    <div className="author">
      <img src={author.profileImageUrl} />
      <span className={author.isMembership ? "membership" : ""}>{author.name}</span>
    </div>
  );
}
