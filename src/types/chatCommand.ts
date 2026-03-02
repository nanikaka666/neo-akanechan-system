import { OptionLabel } from "./competition";

export type ChatCommand = JoinCompetitionCommand;

export interface JoinCompetitionCommand {
  type: "joinCompetition";
  betTo: OptionLabel;
}
