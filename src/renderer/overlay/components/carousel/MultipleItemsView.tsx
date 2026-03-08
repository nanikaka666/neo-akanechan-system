import { ReactElement, useState } from "react";

interface MultipleItemsViewProps {
  items: ReactElement[];
}

export function MultipleItemsView({ items }: MultipleItemsViewProps) {
  const [pos, setPos] = useState(0);

  return (
    <div
      className="multiple carousel-animation font-m-plus-rounded"
      onAnimationIteration={() => {
        setPos((prev) => (prev + 1) % items.length);
      }}
    >
      {items.map((item, idx) => {
        return (
          <div key={item.key} className={idx !== pos % items.length ? "not-selected" : ""}>
            {item}
          </div>
        );
      })}
    </div>
  );
}
