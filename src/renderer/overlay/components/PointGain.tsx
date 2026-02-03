import { Point2D, Popping } from "./Popping";

export interface PointGainProps {
  imgUrl: string;
  gainPoint: number;
  coordinate: Point2D;
  delayMs: number;
}

export function PointGain({ imgUrl, gainPoint, coordinate, delayMs }: PointGainProps) {
  return (
    <>
      <Popping coordinate={coordinate} poppingType="straight" delayMs={delayMs}>
        <img src={imgUrl} />
      </Popping>
      <Popping coordinate={coordinate} poppingType="right" delayMs={delayMs}>
        <div className="font-popping">{gainPoint}</div>
      </Popping>
    </>
  );
}
