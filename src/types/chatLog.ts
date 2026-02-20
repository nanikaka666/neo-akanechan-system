import {
  GiftReceived,
  MembershipGift,
  MembershipMilestone,
  NewMembership,
  SuperChat,
  SuperSticker,
  TextMessageChat,
} from "./liveChatItem";

export type ChatLogData =
  | TextMessageChat
  | SuperChat
  | SuperSticker
  | NewMembership
  | MembershipMilestone
  | MembershipGift
  | GiftReceived;

export interface ChatLog {
  data: ChatLogData;
  votedTo?: string;
}
