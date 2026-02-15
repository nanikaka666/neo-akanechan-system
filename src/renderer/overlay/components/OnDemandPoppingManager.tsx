import { useCallback, useEffect, useState } from "react";
import { PointInfoFromMainProcess } from "../../../types/overlay";
import { PointGet } from "../types";
import { PointGain } from "./PointGain";

const DELAY_MS = 180;
const CHUNK_NUM = 5;

export interface OnDemand {
  buffer: PointInfoFromMainProcess[];
  funcOnLastAnimationEnded: () => void;
}

export interface OnDemandPoppingManagerProps {
  onDemand: OnDemand;
}

export function OnDemandPoppingManager({ onDemand }: OnDemandPoppingManagerProps) {
  const [buffer, setBuffer] = useState<PointInfoFromMainProcess[]>(onDemand.buffer);
  const [items, setItems] = useState<PointGet[]>([]);

  const reflect = useCallback(() => {
    const chunked = (list: PointInfoFromMainProcess[]): PointInfoFromMainProcess[][] => {
      return list.flatMap((_, idx, a) => {
        return idx % CHUNK_NUM === 0 ? [a.slice(idx, idx + CHUNK_NUM)] : [];
      });
    };
    const pickBaseCoordinate = () => {
      return {
        x: Math.round(Math.random() * 75), // 0 ~ 75
        y: Math.round(Math.random() * 57 + 35), // 35 ~ 92
      };
    };
    const res: PointGet[] = chunked(buffer).flatMap((values, i) => {
      const baseCoordinate = pickBaseCoordinate();
      return values.map((value, j) => {
        const itemId = crypto.randomUUID();
        return {
          itemId: itemId,
          coordinate: {
            x: baseCoordinate.x,
            y: baseCoordinate.y - 8 * j,
          },
          delayMs: CHUNK_NUM * i * DELAY_MS + DELAY_MS * j,
          animationEndFunc: () => {
            setItems((prev) => prev.filter((val) => val.itemId !== itemId));
            if (onDemand.buffer.length - 1 === i * CHUNK_NUM + j) {
              onDemand.funcOnLastAnimationEnded();
            }
          },
          img: value.img,
          value: value.point,
        } satisfies PointGet;
      });
    });
    setItems((prev) => [...prev, ...res]);
    setBuffer((_) => []);
  }, [onDemand, buffer]);

  useEffect(() => {
    setTimeout(() => reflect(), 0);
  }, [reflect]);

  return items.map((item) => {
    return <PointGain key={item.itemId} {...item} />;
  });
}
