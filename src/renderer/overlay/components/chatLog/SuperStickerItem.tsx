import { OptionLabel } from "../../../../types/competition";
import { SuperSticker } from "../../../../types/liveChatItem";
import { Author } from "./Author";

interface SuperStickerItemProps {
  item: SuperSticker;
  votedTo?: OptionLabel;
}

export function SuperStickerItem({ item, votedTo }: SuperStickerItemProps) {
  const tierClassName = `tier-${item.tier.level}`;
  return (
    <div className={`chat-log-item super ${tierClassName}`}>
      <Author author={item.author} votedTo={votedTo} />
      <div className="amount">{item.amount}</div>
      <div className="message">{item.sticker.altText}</div>
    </div>
  );
}
