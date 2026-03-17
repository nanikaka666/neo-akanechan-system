import { useState } from "react";
import { ListRange } from "react-virtuoso";

export function useListRange() {
  const [range, setRange] = useState<ListRange>({ startIndex: 0, endIndex: 0 });

  const rangeUpdator = (nextRange: ListRange) => {
    setRange((_) => nextRange);
  };

  return [range, rangeUpdator] as const;
}
