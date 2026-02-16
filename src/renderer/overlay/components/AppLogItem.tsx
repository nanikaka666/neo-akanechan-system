import { Children } from "../types";

export type AppLogItemProps = {
  itemId: string;
  animamtionEndFunc: () => void;
} & Children;

export function AppLogItem({ animamtionEndFunc, children }: AppLogItemProps) {
  return <li onAnimationEnd={animamtionEndFunc}>{children}</li>;
}
