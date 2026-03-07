import { PoppingItemProps } from "../../types";

export function Popping({
  coordinate,
  animationType,
  delayMs,
  animationEndFunc,
  children,
}: PoppingItemProps) {
  const animationTypeClassName =
    animationType === "straight" ? "bound-to-straight" : "bound-to-right";

  return (
    <div
      onAnimationEnd={animationEndFunc}
      style={{
        position: "absolute",
        top: `${coordinate.y}vh`,
        left: `${coordinate.x}vw`,
        animationDelay: `${delayMs}ms`,
      }}
      className={["popping", animationTypeClassName].join(" ")}
    >
      {children}
    </div>
  );
}
