import { Children } from "../types";

export type AppLogItemProps = {
  itemId: string;
  animamtionEndFunc: () => void;
} & Children;

export function AppLogItem({ animamtionEndFunc, children }: AppLogItemProps) {
  return (
    <li className="app-log-item app-log-item-animation" onAnimationEnd={animamtionEndFunc}>
      {children}
    </li>
  );
}
