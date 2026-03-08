import { ReactElement, useState } from "react";

interface MultipleItemsViewProps {
  items: ReactElement[];
}

export function MultipleItemsView({ items }: MultipleItemsViewProps) {
  const [pos, setPos] = useState(0);

  return (
    <div
      className="carousel-animation font-m-plus-rounded"
      onAnimationIteration={() => {
        setPos((prev) => (prev + 1) % items.length);
      }}
    >
      {items.map((item, idx) => {
        return (
          <div key={item.key} style={idx === pos % items.length ? {} : { display: "none" }}>
            {item}
          </div>
        );
      })}
    </div>
  );
}
