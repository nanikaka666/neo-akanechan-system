import { ParticipantPoint } from "../../../types/participantPoint";
import {
  ChatAuthor,
  FirstMarkable,
  SuperChat,
  SuperSticker,
  TextMessageChat,
} from "../../../types/liveChatItem";

export class PariticipantPointManager {
  readonly #points: Map<string, ParticipantPoint>;
  constructor() {
    this.#points = new Map();
  }
  get() {
    return this.#points;
  }

  /**
   * plus point of first chatting.
   *
   * @returns point is added.
   */
  addByFirstChat(item: (TextMessageChat | SuperChat | SuperSticker) & FirstMarkable) {
    if (!item.isFirst) {
      return false;
    }
    return this.add(item.author, 100);
  }

  /**
   * Add point to author.
   *
   * @returns point is added.
   */
  add(author: ChatAuthor, value: number) {
    if (author.isOwner) {
      return false;
    }
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
    return true;
  }
}
