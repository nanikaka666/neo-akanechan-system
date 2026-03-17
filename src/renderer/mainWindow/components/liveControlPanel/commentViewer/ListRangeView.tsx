import { ListRange } from "react-virtuoso";

interface ListRangeViewProps {
  /**
   * the range of index in a chunk which is visible.
   * A chunk means list of chat items.
   *
   * Text chat list is chunked by 1000, so that the range will be in 0 ~ 999.
   * Other chat item list is not chunked, so that the range will be in its sizes.
   */
  range: ListRange;

  chunkSize: number;
}

export function ListRangeView({ range, chunkSize }: ListRangeViewProps) {
  return (
    <p>
      Range: {range.startIndex} - {range.endIndex} / {chunkSize}
    </p>
  );
}
