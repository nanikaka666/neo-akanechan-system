import { OptionLabel } from "../../../../types/competition";
import { ChatAuthor } from "../../../../types/liveChatItem";

interface AuthorProps {
  author: ChatAuthor;
  votedTo?: OptionLabel;
}

export function Author({ author, votedTo }: AuthorProps) {
  const nameClassName = author.isMembership ? "name member" : "name";

  return (
    <div className="author">
      <img src={author.profileImageUrl} />
      <p className={nameClassName}>{author.name}</p>
      {votedTo && <p className="voted-to">{votedTo.toUpperCase()}</p>}
    </div>
  );
}
