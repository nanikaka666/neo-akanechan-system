import { useCallback, useEffect, useState } from "react";
import { PointGet, PointInfoFromMainProcess } from "../types";
import { PointGain } from "./PointGain";

function makeRandomData(length: number) {
  const data: PointInfoFromMainProcess[] = new Array(length).fill(0).map(() => {
    return {
      img: "",
      point: Math.round(Math.random() * 1000),
    };
  });
  return data;
}

const DELAY_MS = 180;
const CHUNK_NUM = 5;

export function PoppingManager() {
  const [buffer, setBuffer] = useState<PointInfoFromMainProcess[]>(makeRandomData(1));
  const [items, setItems] = useState<PointGet[]>([]);

  const debug = useCallback(() => {
    setBuffer((prev) => [...prev, ...makeRandomData(11)]);
  }, []);

  const reflect = useCallback(() => {
    const chunked: PointInfoFromMainProcess[][] = buffer.flatMap((_, idx, a) => {
      return idx % CHUNK_NUM === 0 ? [a.slice(idx, idx + CHUNK_NUM)] : [];
    });
    const res: PointGet[] = chunked.flatMap((values, i) => {
      const delayOffset = DELAY_MS * CHUNK_NUM * i;
      const baseCoordinate = {
        x: Math.round(Math.random() * 75), // 0 ~ 75
        y: Math.round(Math.random() * 57 + 35), // 35 ~ 92
      };
      return values.map((value, j) => {
        const itemId = crypto.randomUUID();
        return {
          itemId: itemId,
          coordinate: {
            x: baseCoordinate.x,
            y: baseCoordinate.y - 8 * j,
          },
          delayMs: delayOffset + DELAY_MS * j,
          animationEndFunc: () => setItems((prev) => prev.filter((val) => val.itemId !== itemId)),
          img: value.img,
          value: value.point,
        } satisfies PointGet;
      });
    });
    setBuffer((_) => []);
    setItems((prev) => [...prev, ...res]);
  }, [buffer]);

  useEffect(() => {
    const intervalId = setInterval(() => reflect(), 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [reflect]);

  useEffect(() => {
    const debugInterval = setInterval(() => debug(), 2000);
    return () => {
      clearInterval(debugInterval);
    };
  }, [debug]);

  return items.map((item) => {
    return <PointGain key={item.itemId} {...item} />;
  });
}
