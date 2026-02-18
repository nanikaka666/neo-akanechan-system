export const POPPING_ANIMATION_DELAY_MS_UNIT = 180; // 180ms between popping item shows
export const POPPING_ITEM_CHUNK_NUM = 5; // number of popping item in haystack

export class CaseDropError extends Error {
  constructor(_: never) {
    super();
  }
}
