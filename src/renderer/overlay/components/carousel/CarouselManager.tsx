import { ReactElement, useCallback, useState } from "react";

interface CarouselManagerProps {
  items: ReactElement[];
}

export function CarouselManager({ items }: CarouselManagerProps) {
  const [pos, setPos] = useState(0);

  const selectedPos = useCallback(() => {
    if (items.length === 0) {
      return 0;
    }
    if (items.length <= pos) {
      return 0;
    } else {
      return pos;
    }
  }, [items, pos]);

  return items.length === 0 ? null : (
    <div className="carousel-container">
      {items.length === 1 ? (
        <div className="carousel-only-one-animation font-m-plus-rounded">{items[0]}</div>
      ) : (
        <div
          className="carousel-animation font-m-plus-rounded"
          onAnimationIteration={() => {
            setPos((prev) => (prev + 1) % items.length);
          }}
        >
          {items.map((item, idx) => {
            return (
              <div key={item.key} style={idx === selectedPos() ? {} : { display: "none" }}>
                {item}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
