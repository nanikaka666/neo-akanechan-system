import { useCallback, useEffect, useState } from "react";
import { PointGet } from "../types";
import { PointInfoFromMainProcess } from "../../../types/overlay";
import { PointGain } from "./PointGain";
import { POPPING_ANIMATION_DELAY_MS_UNIT, POPPING_ITEM_CHUNK_NUM } from "../constants";

export function PoppingManager() {
  const [buffer, setBuffer] = useState<PointInfoFromMainProcess[]>([]);
  const [items, setItems] = useState<PointGet[]>([]);

  const reflect = useCallback(() => {
    const chunked = (list: PointInfoFromMainProcess[]): PointInfoFromMainProcess[][] => {
      return list.flatMap((_, idx, a) => {
        return idx % POPPING_ITEM_CHUNK_NUM === 0
          ? [a.slice(idx, idx + POPPING_ITEM_CHUNK_NUM)]
          : [];
      });
    };
    const pickBaseCoordinate = () => {
      return {
        x: Math.round(Math.random() * 75), // 0 ~ 75
        y: Math.round(Math.random() * 57 + 35), // 35 ~ 92
      };
    };
    const res: PointGet[] = chunked(buffer).flatMap((values, i) => {
      const delayOffset = POPPING_ANIMATION_DELAY_MS_UNIT * POPPING_ITEM_CHUNK_NUM * i;
      const baseCoordinate = pickBaseCoordinate();
      return values.map((value, j) => {
        const itemId = crypto.randomUUID();
        return {
          itemId: itemId,
          coordinate: {
            x: baseCoordinate.x,
            y: baseCoordinate.y - 8 * j,
          },
          delayMs: delayOffset + POPPING_ANIMATION_DELAY_MS_UNIT * j,
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
    const remover = window.ipcApi.registerAmountOfPoint((e, item) => {
      setBuffer((prev) => [...prev, item]);
    });
    return () => remover();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => reflect(), 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [reflect]);

  return items.map((item) => {
    return <PointGain key={item.itemId} {...item} />;
  });
}
