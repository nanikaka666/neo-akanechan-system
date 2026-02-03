import { ReactElement } from "react";

// todo: move to suitable file
export interface PointInfoFromMainProcess {
  img: string;
  point: number;
}

export interface PoppingItem {
  coordinate: {
    x: number;
    y: number;
  };
  delayMs: number;
  animationEndFunc: () => void;
}

export interface PoppingAnimation {
  animationType: PoppingAnimationType;
}

export interface Children {
  children: ReactElement | string;
}

export type PoppingAnimationType = "straight" | "right";

export type PoppingItemProps = PoppingItem & Children & PoppingAnimation;

export type PointGet = {
  itemId: string;
  img: string;
  value: number;
} & PoppingItem;
