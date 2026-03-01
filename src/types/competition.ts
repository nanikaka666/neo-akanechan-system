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
  statistics: CompetitionStatistics;
}

export interface EntryClosedCompetition {
  type: "entryClosed";
  settings: CompetitionSettings;
  statistics: CompetitionStatistics;
}

export type CompetitionStatus = NotHeldCompetition | HeldCompetition | EntryClosedCompetition;

export interface CompetitionStatisticsUnit {
  betCount: number;
  totalStakes: number;
}

export interface CompetitionStatistics {
  all: CompetitionStatisticsUnit;
  options: Map<OptionLabel, CompetitionStatisticsUnit>;
}
