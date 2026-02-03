import { PointGet } from "../types";
import { Popping } from "./Popping";

export function PointGain({ img, value, coordinate, delayMs, animationEndFunc }: PointGet) {
  return (
    <>
      <Popping
        coordinate={coordinate}
        animationType="straight"
        delayMs={delayMs}
        animationEndFunc={animationEndFunc}
      >
        <img src={img} />
      </Popping>
      <Popping
        coordinate={coordinate}
        animationType="right"
        delayMs={delayMs}
        animationEndFunc={animationEndFunc}
      >
        <div className="font-popping">{value}</div>
      </Popping>
    </>
  );
}
