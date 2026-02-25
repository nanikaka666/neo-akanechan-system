import { ChatAuthor } from "./liveChatItem";

export type OptionLabel = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";

export interface CompetitionSettings {
  competitionId: string;
  question: string;
  options: Map<OptionLabel, string>;
  scheduledClosedAt: Date;
}

export interface Bet {
  entryId: number;
  author: ChatAuthor;
  stake: number;
  betTo: OptionLabel;
}

export interface NotHeldCompetition {
  type: "notHeld";
}

export interface HeldCompetition {
  type: "held";
  settings: CompetitionSettings;
  betAuthorChannelIds: Set<string>;
  bets: Bet[];
}

export interface EntryClosedCompetition {
  type: "entryClosed";
  settings: CompetitionSettings;
  bets: Bet[];
}

export type CompetitionStatus = NotHeldCompetition | HeldCompetition | EntryClosedCompetition;

export interface CompetitionStatistics {
  totalBetCount: number;
  totalStakes: number;
  options: Map<
    OptionLabel,
    {
      totalBetCount: number;
      totalStakes: number;
    }
  >;
}
