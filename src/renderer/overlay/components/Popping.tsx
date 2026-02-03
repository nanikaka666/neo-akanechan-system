import { ReactElement } from "react";

export interface Point2D {
  x: number;
  y: number;
}

export type PoppingType = "straight" | "right";

export interface Children {
  children: ReactElement | string;
}

export interface PoppingProps {
  coordinate: Point2D;
  poppingType: PoppingType;
  delayMs: number;
}

export function Popping({ coordinate, poppingType, delayMs, children }: PoppingProps & Children) {
  return (
    <div
      style={{
        opacity: 0,
        position: "absolute",
        top: `${coordinate.y}vh`,
        left: `${coordinate.x}vw`,
        animationDelay: `${delayMs}ms`,
      }}
      className={[poppingType === "straight" ? "ani" : "yokoani"].join(" ")}
    >
      {children}
    </div>
  );
}
