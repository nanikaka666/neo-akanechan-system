import { PoppingItemProps } from "../types";

export function Popping({
  coordinate,
  animationType,
  delayMs,
  animationEndFunc,
  children,
}: PoppingItemProps) {
  return (
    <div
      onAnimationEnd={animationEndFunc}
      style={{
        opacity: 0,
        position: "absolute",
        top: `${coordinate.y}vh`,
        left: `${coordinate.x}vw`,
        animationDelay: `${delayMs}ms`,
      }}
      className={[animationType === "straight" ? "ani" : "yokoani"].join(" ")}
    >
      {children}
    </div>
  );
}
