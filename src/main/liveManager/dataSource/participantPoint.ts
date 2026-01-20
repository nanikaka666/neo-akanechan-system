import { ParticipantPoint, ParticipantPointRankingData } from "../../../types/participantPoint";
import { ChatAuthor } from "../../../types/liveChatItem";

export class PariticipantPointManager {
  readonly #points: Map<string, ParticipantPoint>;
  constructor() {
    this.#points = new Map();
  }
  #sortFunction(a: ParticipantPoint, b: ParticipantPoint) {
    return b.point === a.point
      ? a.participatedTime.getTime() - b.participatedTime.getTime()
      : b.point - a.point;
  }
  add(author: ChatAuthor, value: number) {
    const current = this.#points.get(author.channelId.id);
    if (current === undefined) {
      this.#points.set(author.channelId.id, {
        point: value,
        author: author,
        participatedTime: new Date(),
      });
    } else {
      this.#points.set(author.channelId.id, {
        ...current,
        point: current.point + value,
        author: author,
      });
    }
  }
  getRankings(limit: number = 100) {
    const sorted = Array.from(this.#points.values()).sort(this.#sortFunction).slice(0, limit);

    let res: ParticipantPointRankingData[] = [];
    res = [{ rank: 1, participantPoint: sorted[0] }];
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].point === sorted[i - 1].point) {
        res = [...res, { rank: res[i - 1].rank, participantPoint: sorted[i] }];
      } else {
        res = [...res, { rank: i + 1, participantPoint: sorted[i] }];
      }
    }
    return res;
  }
}
