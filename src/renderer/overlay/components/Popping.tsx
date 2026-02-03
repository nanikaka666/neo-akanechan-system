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
}

export function Popping(props: PoppingProps & Children) {
  return (
    <div
      style={{
        opacity: 0,
        position: "absolute",
        top: `${props.coordinate.y}px`,
        left: `${props.coordinate.x}px`,
      }}
      className={["font-popping", props.poppingType === "straight" ? "ani" : "yokoani"].join(" ")}
    >
      {props.children}
    </div>
  );
}
