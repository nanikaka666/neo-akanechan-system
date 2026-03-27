import { ExtendedChatItemSuperSticker } from "../../../../../types/liveChatItem";
import { Author } from "./Author";
import { FocusForm } from "./FocusForm";

interface SuperStickerItemProps {
  item: ExtendedChatItemSuperSticker;
}

export function SuperStickerItem({ item }: SuperStickerItemProps) {
  const tier = `tier-${item.tier.level}`;

  return (
    <div className={`item super-sticker ${tier}`}>
      <div className="contents">
        <Author author={item.author} />
        <span className="amount">{item.amount}</span>
        <span>{item.sticker.altText}</span>
      </div>
      <div className="buttons">
        <FocusForm item={item} />
      </div>
    </div>
  );
}
