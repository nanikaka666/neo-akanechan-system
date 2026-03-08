import { ReactElement, useCallback, useState } from "react";

interface MultipleItemsViewProps {
  items: ReactElement[];
}

export function MultipleItemsView({ items }: MultipleItemsViewProps) {
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

  return (
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
  );
}
