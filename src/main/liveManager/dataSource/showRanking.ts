import { PariticipantPointRankings } from "../../../types/participantPoint";

export class ShowRankingManager {
  #ranking?: PariticipantPointRankings;
  constructor() {}

  get() {
    return this.#ranking;
  }

  isShown() {
    return this.#ranking !== undefined;
  }

  updateRanking(ranking: PariticipantPointRankings) {
    this.#ranking = ranking;
  }

  hideRanking() {
    this.#ranking = undefined;
  }
}
