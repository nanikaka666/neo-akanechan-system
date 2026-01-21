import { ParticipantPoint } from "../../../types/participantPoint";
import { ChatAuthor } from "../../../types/liveChatItem";

export class PariticipantPointManager {
  readonly #points: Map<string, ParticipantPoint>;
  constructor() {
    this.#points = new Map();
  }
  get() {
    return this.#points;
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
}
