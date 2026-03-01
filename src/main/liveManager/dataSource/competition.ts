import { ChatAuthor } from "../../../types/liveChatItem";
import {
  Bet,
  CompetitionStatisticsUnit,
  CompetitionStatus,
  HeldCompetition,
  OptionLabel,
} from "../../../types/competition";

export class CompetitionManager {
  #status: CompetitionStatus;
  #timeout?: NodeJS.Timeout;
  #betAuthorChannelIds: Set<string>;
  #bets: Bet[];
  constructor() {
    this.#status = { type: "notHeld" };
    this.#betAuthorChannelIds = new Set();
    this.#bets = [];
  }

  get() {
    return this.#status;
  }

  openCompetition(
    question: string,
    options: string[],
    willCloseInMinutes: number,
    callback: () => void,
  ): HeldCompetition {
    if (this.#status.type !== "notHeld") {
      throw new Error("Competition is already held.");
    }
    if (this.#timeout !== undefined) {
      throw new Error("timeout not handled.");
    }
    if (options.length < 2 || 9 <= options.length) {
      throw new Error("options too much.");
    }
    if (willCloseInMinutes < 1 || 180 < willCloseInMinutes) {
      throw new Error("competition must be closed in 1 ~ 180 minutes.");
    }

    this.#betAuthorChannelIds.clear();
    this.#bets = [];

    const competitionId = crypto.randomUUID();
    const currentTime = new Date();
    const diff = this.#calcDiffMillis(currentTime, willCloseInMinutes);
    const scheduledCloseAt = new Date(currentTime.getTime() + diff);
    this.#timeout = setTimeout(() => {
      if (this.#closeBetting(competitionId)) {
        callback();
      }
    }, diff);
    const settingsOptionsMap = new Map<OptionLabel, string>();
    const optionStatistics = new Map<OptionLabel, CompetitionStatisticsUnit>();
    options.forEach((option, idx) => {
      const label = this.#getOptionLabel(idx as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7);
      settingsOptionsMap.set(label, option);
      optionStatistics.set(label, {
        betCount: 0,
        totalStakes: 0,
      });
    });

    return (this.#status = {
      type: "held",
      settings: {
        competitionId: competitionId,
        question: question,
        options: settingsOptionsMap,
        scheduledClosedAt: scheduledCloseAt,
      },
      statistics: {
        all: {
          betCount: 0,
          totalStakes: 0,
        },
        options: optionStatistics,
      },
    });
  }

  manuallyCloseBetting() {
    if (this.#status.type !== "held") {
      return false;
    }
    if (this.#timeout) {
      clearTimeout(this.#timeout);
      this.#timeout = undefined;
    }
    this.#status = { ...this.#status, type: "entryClosed" };
    return true;
  }

  bet(author: ChatAuthor, betTo: OptionLabel, stake: number) {
    if (this.#status.type !== "held") {
      return;
    }
    if (author.isOwner) {
      return;
    }
    if (!this.#status.settings.options.has(betTo)) {
      throw new Error(`${betTo} is invalid option.`);
    }
    if (this.#betAuthorChannelIds.has(author.channelId.id)) {
      return;
    }
    if (stake < 1) {
      return;
    }
    const betData: Bet = {
      entryId: this.#betAuthorChannelIds.size + 1,
      author: author,
      stake: stake,
      betTo: betTo,
    };
    this.#bets = [...this.#bets, betData];
    this.#betAuthorChannelIds.add(author.channelId.id);

    // update statistics
    this.#status.statistics.all.betCount++;
    this.#status.statistics.all.totalStakes += stake;

    const optionStatistics = this.#status.statistics.options.get(betTo);
    if (optionStatistics === undefined) {
      throw new Error(`Competition Statistics doesn't have a key ${betTo}`);
    }
    this.#status.statistics.options.set(betTo, {
      betCount: optionStatistics.betCount + 1,
      totalStakes: optionStatistics.totalStakes + stake,
    });
  }

  close() {
    this.#status = { type: "notHeld" };
    if (this.#timeout) {
      clearTimeout(this.#timeout);
      this.#timeout = undefined;
    }
    this.#betAuthorChannelIds.clear();
    this.#bets = [];
  }

  /**
   * Calc difference between current and betting closed time in millis.
   *
   * suppliments
   * - betting closed time will has 0 seconds. So it is possible divide with 60,000.
   *
   * example
   * current time: 15:00:25.123
   * given minutes: 30
   * calculated betting close time: 15:31:00.000
   *
   * this function returns (15:31:00.000) - (15:00:25.123) in milli seconds.
   */
  #calcDiffMillis(currentTime: Date, minutes: number) {
    return minutes * 60000 + ((60000 - (currentTime.getTime() % 60000)) % 60000);
  }

  #closeBetting(competitionId: string) {
    if (this.#status.type !== "held") {
      return false;
    }
    if (this.#status.settings.competitionId !== competitionId) {
      return false;
    }
    this.#status = { ...this.#status, type: "entryClosed" };
    return true;
  }

  #getOptionLabel(index: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7): OptionLabel {
    const label = "abcdefgh";
    return label.charAt(index) as OptionLabel;
  }
}
