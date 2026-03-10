import { useCallback, useEffect, useState } from "react";
import { PointInfoFromMainProcess } from "../../../../types/overlay";
import { POPPING_ITEM_CHUNK_NUM, POPPING_ANIMATION_DELAY_MS_UNIT } from "../../constants";
import { PointGet } from "../../types";
import { PointGain } from "./PointGain";

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
        return idx % POPPING_ITEM_CHUNK_NUM === 0
          ? [a.slice(idx, idx + POPPING_ITEM_CHUNK_NUM)]
          : [];
      });
    };
    const pickBaseCoordinate = () => {
      return {
        x: Math.round(Math.random() * 62 + 3), // 3 ~ 65
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
          delayMs:
            POPPING_ITEM_CHUNK_NUM * i * POPPING_ANIMATION_DELAY_MS_UNIT +
            POPPING_ANIMATION_DELAY_MS_UNIT * j,
          animationEndFunc: () => {
            setItems((prev) => prev.filter((val) => val.itemId !== itemId));
            if (onDemand.buffer.length - 1 === i * POPPING_ITEM_CHUNK_NUM + j) {
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

  return (
    <div className="popping-container">
      {items.map((item) => {
        return <PointGain key={item.itemId} {...item} />;
      })}
    </div>
  );
}
