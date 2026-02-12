import { ReactElement, useState } from "react";

export interface CarouselManagerProps {
  items: ReactElement[];
}

export function CarouselManager({ items }: CarouselManagerProps) {
  const [pos, setPos] = useState(0);

  return 0 < items.length ? (
    <div
      style={{
        position: "absolute",
        bottom: 50,
        left: 50,
        zIndex: 1,
      }}
    >
      <div
        className="carousel-animation font-m-plus-rounded"
        onAnimationIteration={() => {
          setPos((prev) => (prev + 1) % items.length);
        }}
      >
        {items.map((item, idx) => {
          return (
            <div key={idx} style={idx !== pos ? { display: "none" } : {}}>
              {item}
            </div>
          );
        })}
      </div>
    </div>
  ) : null;
}
