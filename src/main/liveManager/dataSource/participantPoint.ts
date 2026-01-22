import { ParticipantPoint } from "../../../types/participantPoint";
import {
  ChatAuthor,
  FirstMarkable,
  MembershipGift,
  MembershipMilestone,
  NewMembership,
  SuperChat,
  SuperSticker,
  TextMessageChat,
} from "../../../types/liveChatItem";

export class PariticipantPointManager {
  readonly #points: Map<string, ParticipantPoint>;

  /**
   * Records the Date which is counted point adding as continuous chat point.
   *
   * key is author channel id.
   */
  readonly #continuousChatLastAdded: Map<string, Date>;

  /**
   * LiveChatItemId set which used to adding point of stock.
   */
  readonly #stocksAdded: Set<string>;

  /**
   * LiveChatItemId set which used to adding point of focus
   */
  readonly #focusAdded: Set<string>;

  /**
   * Disqualified channel ids.
   */
  readonly #disqualifiedChannelIds: Set<string>;

  constructor() {
    this.#points = new Map();
    this.#continuousChatLastAdded = new Map();
    this.#stocksAdded = new Set();
    this.#focusAdded = new Set();
    this.#disqualifiedChannelIds = new Set();
  }
  get() {
    return this.#points;
  }

  /**
   * plus point of first chatting.
   *
   * @returns added point amount. `0` means adding point cancelled.
   */
  addByFirstChat(item: (TextMessageChat | SuperChat | SuperSticker) & FirstMarkable) {
    if (!item.isFirst) {
      return 0;
    }
    return this.#add(item.author, 100);
  }

  /**
   * plus point of continuous chat.
   *
   * @returns added point amount. `0` means adding point cancelled.
   */
  addByContinuousChat(item: TextMessageChat | SuperChat | SuperSticker) {
    const lastAddedTime = this.#continuousChatLastAdded.get(item.author.channelId.id);
    if (
      lastAddedTime === undefined ||
      lastAddedTime.getTime() + 30 * 1000 < item.publishedAt.getTime() // if 30 seconds passed from last point adding, then add point.
    ) {
      this.#continuousChatLastAdded.set(item.author.channelId.id, item.publishedAt);
      return this.#add(item.author, 10);
    } else {
      return 0;
    }
  }

  /**
   * plus point of stock.
   *
   * @returns added point amount. `0` means adding point cancelled.
   */
  addByStocked(item: TextMessageChat) {
    if (this.#stocksAdded.has(item.id.id)) {
      return 0;
    }
    this.#stocksAdded.add(item.id.id);
    return this.#add(item.author, 100);
  }

  /**
   *
   * plus point of focus.
   *
   * @returns added point amount. `0` means adding point cancelled.
   */
  addByFocused(item: TextMessageChat | SuperChat | SuperSticker) {
    if (this.#focusAdded.has(item.id.id)) {
      return 0;
    }
    this.#focusAdded.add(item.id.id);
    return this.#add(item.author, 300);
  }

  /**
   *
   * plus point of new membership.
   *
   * @returns added point amount. `0` means adding point cancelled.
   */
  addByNewMembership(item: NewMembership) {
    return this.#add(item.author, 1000);
  }

  /**
   *
   * plus point of membership milestone.
   *
   * @returns added point amount. `0` means adding point cancelled.
   */
  addByMembershipMilestone(item: MembershipMilestone) {
    return this.#add(item.author, 1000 * Math.sqrt(item.memberMonth));
  }

  /**
   *
   * plus point of membership gift.
   *
   * @returns added point amount. `0` means adding point cancelled.
   */
  addByMembershipGift(item: MembershipGift) {
    return this.#add(item.author, 1800 * Math.sqrt(item.giftCount));
  }

  addByManualPlusPoints(item: TextMessageChat | SuperChat | SuperSticker) {
    return this.#add(item.author, 10);
  }

  /**
   * Disqualify the user.
   *
   * disqualified users are out of point rankings.
   *
   * @returns whether disqualify process done. if they are already disqualified then `false`.
   */
  disqualify(author: ChatAuthor) {
    if (!this.#disqualifiedChannelIds.has(author.channelId.id)) {
      return false;
    }
    this.#disqualifiedChannelIds.add(author.channelId.id);
    this.#points.delete(author.channelId.id);
    return true;
  }

  /**
   * Add point to author.
   *
   * @returns added point amount. `0` means adding point cancelled.
   */
  #add(author: ChatAuthor, value: number) {
    if (this.#disqualifiedChannelIds.has(author.channelId.id)) {
      return 0;
    }
    if (author.isOwner) {
      return 0;
    }
    // if author is membership, added amount of point raised by 20%.
    const addedAmount = Math.round(author.isMembership ? value * 1.2 : value);
    const current = this.#points.get(author.channelId.id);
    if (current === undefined) {
      this.#points.set(author.channelId.id, {
        point: addedAmount,
        author: author,
        participatedTime: new Date(),
      });
    } else {
      this.#points.set(author.channelId.id, {
        ...current,
        point: current.point + addedAmount,
        author: author,
      });
    }
    return addedAmount;
  }
}
