import { ChatLog } from "../../../../types/chatLog";
import { GiftReceivedItem } from "./GiftReceivedItem";
import { MembershipGiftItem } from "./MembershipGiftItem";
import { MembershipMilestoneItem } from "./MembershipMilestoneItem";
import { NewMembershipItem } from "./NewMembershipItem";
import { SuperChatItem } from "./SuperChatItem";
import { SuperStickerItem } from "./SuperStickerItem";
import { TextItem } from "./TextItem";

interface ChatLogItemProps {
  item: ChatLog;
}

export function ChatLogItem({ item }: ChatLogItemProps) {
  return item.data.type === "text" ? (
    <TextItem item={item.data} votedTo={item.votedTo} />
  ) : item.data.type === "superChat" ? (
    <SuperChatItem item={item.data} votedTo={item.votedTo} />
  ) : item.data.type === "superSticker" ? (
    <SuperStickerItem item={item.data} votedTo={item.votedTo} />
  ) : item.data.type === "newMembership" ? (
    <NewMembershipItem item={item.data} votedTo={item.votedTo} />
  ) : item.data.type === "milestone" ? (
    <MembershipMilestoneItem item={item.data} votedTo={item.votedTo} />
  ) : item.data.type === "gift" ? (
    <MembershipGiftItem item={item.data} votedTo={item.votedTo} />
  ) : (
    <GiftReceivedItem item={item.data} />
  );
}
