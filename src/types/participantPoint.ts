import { ChatAuthor } from "./liveChatItem";

export interface ParticipantPoint {
  point: number;
  author: ChatAuthor;
  participatedTime: Date;
}

export interface ParticipantPointRankingData {
  rank: number;
  participantPoint: ParticipantPoint;
}

export interface PariticipantPointRankings {
  items: ParticipantPointRankingData[];
  updatedAt: Date;
}
