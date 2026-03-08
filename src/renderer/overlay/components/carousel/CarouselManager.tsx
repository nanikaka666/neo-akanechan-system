import { ReactElement } from "react";
import { SingleItemView } from "./SingleItemView";
import { MultipleItemsView } from "./MultipleItemsView";

interface CarouselManagerProps {
  items: ReactElement[];
}

export function CarouselManager({ items }: CarouselManagerProps) {
  return items.length === 0 ? null : (
    <div className="carousel-container">
      {items.length === 1 ? (
        <SingleItemView item={items[0]} />
      ) : (
        <MultipleItemsView items={items} />
      )}
    </div>
  );
}
